// Anthropic Claude 3.5 Sonnet Tool Calling API Route
// Production Backend Endpoint: POST /api/chat
// Accepts student schedule, user message, and returns structured tool executions

import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || ''
});

// Defined tools matching CampusPilot frontend specifications
const TOOLS: Anthropic.Tool[] = [
  {
    name: 'get_schedule',
    description: 'Retrieve the student schedule filtered by day or event type.',
    input_schema: {
      type: 'object',
      properties: {
        day: { type: 'string', description: 'Day of week (Monday, Tuesday, etc.)' },
        type: { type: 'string', description: 'Event type filter' }
      }
    }
  },
  {
    name: 'find_free_slots',
    description: 'Find free time gaps between classes on a given day to schedule study time.',
    input_schema: {
      type: 'object',
      properties: {
        day: { type: 'string', description: 'Day of week' },
        minDurationMinutes: { type: 'number', description: 'Minimum minutes needed (default 45)' }
      },
      required: ['day']
    }
  },
  {
    name: 'propose_add_event',
    description: 'Propose adding a class, study session, deadline, or exam. Requires user confirmation.',
    input_schema: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        courseCode: { type: 'string' },
        type: { type: 'string', enum: ['class', 'study', 'assignment', 'exam', 'club', 'orientation', 'personal'] },
        day: { type: 'string' },
        startTime: { type: 'string' },
        endTime: { type: 'string' },
        venue: { type: 'string' },
        notes: { type: 'string' }
      },
      required: ['title', 'day', 'startTime', 'endTime', 'type']
    }
  },
  {
    name: 'propose_delete_event',
    description: 'Propose deleting an event. Requires user confirmation.',
    input_schema: {
      type: 'object',
      properties: {
        eventId: { type: 'string' },
        title: { type: 'string' }
      },
      required: ['eventId']
    }
  }
];

export async function handleCampusPilotChat(req: Request) {
  try {
    const { messages, studentProfile, currentSchedule } = await req.json();

    const systemPrompt = `You are CampusPilot AI, an inspiring and friendly academic advisor for Nigerian university students (100L/200L).
Student Profile:
- Name: ${studentProfile?.name || 'Student'}
- University: ${studentProfile?.university || 'University of Lagos'}
- Department: ${studentProfile?.department || 'Computer Science'} (${studentProfile?.level || '100 Level'})
- Timezone: Africa/Lagos (WAT, UTC+1).

Current Schedule Summary:
${JSON.stringify(currentSchedule || [], null, 2)}

Instructions:
- Use tool calls to read the schedule or find free study gaps.
- When the student asks to add, reschedule, or remove an event, invoke 'propose_add_event' or 'propose_delete_event'. DO NOT assume it is applied immediately—remind the student that you have prepared the action for their confirmation.
- Be warm, encouraging, and culturally attuned to Nigerian university realities (crowded lecture theatres, Continuous Assessment tests, GST courses).`;

    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1024,
      system: systemPrompt,
      messages: messages.map((m: any) => ({
        role: m.role === 'assistant' ? 'assistant' : 'user',
        content: m.content
      })),
      tools: TOOLS
    });

    // Check if Claude requested tool calls
    const toolCalls = response.content.filter((c: any) => c.type === 'tool_use');
    const textBlocks = response.content.filter((c: any) => c.type === 'text');
    const replyText = textBlocks.map((t: any) => t.text).join('\n');

    return new Response(
      JSON.stringify({
        reply: replyText,
        toolCalls,
        stopReason: response.stop_reason
      }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
