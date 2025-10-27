import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { filePath, title, customerId } = await req.json();
    
    if (!filePath || !customerId) {
      return new Response(
        JSON.stringify({ error: "filePath and customerId are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Download file from storage
    const { data: fileData, error: downloadError } = await supabase.storage
      .from('kb-documents')
      .download(filePath);

    if (downloadError) {
      console.error("Error downloading file:", downloadError);
      return new Response(
        JSON.stringify({ error: "Failed to download file" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Read file as text (for txt files) or use basic extraction
    const arrayBuffer = await fileData.arrayBuffer();
    let content = '';
    
    // Try to decode as text first
    try {
      const decoder = new TextDecoder();
      content = decoder.decode(arrayBuffer);
      
      // If it's binary gibberish (PDF/Word), extract what we can
      if (content.includes('�') || content.length < 50) {
        content = `[Document uploaded: ${title}. This is a binary file. Please use specialized tools to extract text from PDFs/Word documents.]`;
      }
    } catch (e) {
      console.error("Error decoding file:", e);
      content = `[Document uploaded: ${title}. Unable to extract text content.]`;
    }

    // Chunk the content if it's too large
    const CHUNK_SIZE = 2000;
    const chunks: string[] = [];
    
    if (content.length > CHUNK_SIZE) {
      // Split into chunks
      for (let i = 0; i < content.length; i += CHUNK_SIZE) {
        chunks.push(content.substring(i, i + CHUNK_SIZE));
      }
    } else {
      chunks.push(content);
    }

    // Create KB documents for each chunk
    const documents = [];
    for (let i = 0; i < chunks.length; i++) {
      const chunkTitle = chunks.length > 1 ? `${title} (Part ${i + 1}/${chunks.length})` : title;
      
      const { data: doc, error: insertError } = await supabase
        .from('kb_documents')
        .insert({
          customer_id: customerId,
          title: chunkTitle,
          content: chunks[i],
          category: 'Document',
          source_type: 'document',
          file_path: filePath,
          is_active: true,
        })
        .select()
        .single();

      if (insertError) {
        console.error("Error inserting document:", insertError);
        throw insertError;
      }
      
      documents.push(doc);
    }

    console.log(`Successfully created ${documents.length} document(s) from ${title}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        documents,
        chunksCreated: chunks.length 
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  } catch (error) {
    console.error("Error in parse-document function:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
