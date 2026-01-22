export class AIChatController {
  constructor(env) {
    this.db = env.DB;
    this.ai = env.AI;
    this.env = env;
  }

  async chat(request) {
    try {
      const { message } = await request.json();

      if (!message || message.trim().length === 0) {
        return new Response(
          JSON.stringify({ error: 'Message is required' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }

      // Extract search parameters using AI
      const extractionPrompt = `You are a business directory search assistant. Extract the following information from the user's query:
- category: the type of business (e.g., gym, restaurant, salon, hotel, etc.)
- area: the location/area name (e.g., Thane, Andheri, Bandra, etc.)

User query: "${message}"

Respond ONLY with a JSON object in this exact format:
{"category": "extracted category or null", "area": "extracted area or null"}

Examples:
User: "Find gyms in Thane" -> {"category": "gym", "area": "Thane"}
User: "Show restaurants in Andheri" -> {"category": "restaurant", "area": "Andheri"}
User: "List salons near Bandra" -> {"category": "salon", "area": "Bandra"}`;

      // Call Cloudflare AI to extract parameters
      const aiResponse = await this.ai.run(
        '@cf/meta/llama-3-8b-instruct',
        {
          messages: [
            { role: 'system', content: 'You are a helpful assistant that extracts structured data from text. Always respond with valid JSON only.' },
            { role: 'user', content: extractionPrompt }
          ]
        }
      );

      let params = { category: null, area: null };
      try {
        const responseText = aiResponse.response || JSON.stringify(aiResponse);
        const jsonMatch = responseText.match(/\{[^}]+\}/);
        if (jsonMatch) {
          params = JSON.parse(jsonMatch[0]);
        }
      } catch (e) {
        console.error('AI response parsing error:', e);
      }

      // Build SQL query
      let query = `
        SELECT 
          b.id,
          b.business_name,
          b.address,
          b.contact_phone,
          b.contact_email,
          b.rating,
          c.category_name,
          sc.subcategory_name,
          a.area_name
        FROM businesses b
        LEFT JOIN categories c ON b.category_id = c.id
        LEFT JOIN subcategories sc ON b.subcategory_id = sc.id
        LEFT JOIN areas a ON b.area_id = a.id
        WHERE b.is_active = 1
      `;

      const bindings = [];

      // Add category filter
      if (params.category) {
        query += ` AND (
          LOWER(c.category_name) LIKE ? OR 
          LOWER(sc.subcategory_name) LIKE ? OR
          LOWER(b.business_name) LIKE ?
        )`;
        const categoryPattern = `%${params.category.toLowerCase()}%`;
        bindings.push(categoryPattern, categoryPattern, categoryPattern);
      }

      // Add area filter
      if (params.area) {
        query += ` AND (
          LOWER(a.area_name) LIKE ? OR 
          LOWER(b.address) LIKE ?
        )`;
        const areaPattern = `%${params.area.toLowerCase()}%`;
        bindings.push(areaPattern, areaPattern);
      }

      query += ` ORDER BY b.rating DESC, b.business_name ASC LIMIT 10`;

      // Execute query
      const stmt = this.db.prepare(query);
      const result = await stmt.bind(...bindings).all();

      const businesses = result.results || [];

      // Generate response message
      let responseMessage;
      if (businesses.length > 0) {
        const categoryText = params.category ? `${params.category}s` : 'businesses';
        const areaText = params.area ? ` in ${params.area}` : '';
        responseMessage = `I found ${businesses.length} ${categoryText}${areaText}:`;
      } else {
        responseMessage = `I couldn't find any businesses matching your query. Try:
• Different category name (e.g., "gym", "restaurant", "salon")
• Different area name
• More general search terms`;
      }

      return new Response(
        JSON.stringify({
          message: responseMessage,
          businesses: businesses,
          params: params
        }),
        { 
          status: 200, 
          headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          } 
        }
      );

    } catch (error) {
      console.error('AI Chat Error:', error);
      return new Response(
        JSON.stringify({ 
          error: 'Failed to process your request',
          message: 'Sorry, I encountered an error. Please try again.' 
        }),
        { 
          status: 500, 
          headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          } 
        }
      );
    }
  }
}
