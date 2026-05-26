/**
 * Evernote MCP Tool: Create Note
 * Creates a new note in Evernote
 */

const { makeNoteStoreRequest, logToolInvocation, createMCPResponse } = require('./createSearch');

function toEnml(text) {
  const escaped = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\n/g, '<br/>');
  return '<?xml version="1.0" encoding="UTF-8"?>' +
    '<!DOCTYPE en-note SYSTEM "http://xml.evernote.com/pub/enml2.dtd">' +
    `<en-note>${escaped}</en-note>`;
}

async function createNote(args, tokenData) {
  logToolInvocation('createNote', args);

  try {
    if (!args.title) {
      return createMCPResponse('error', null, 'title is required');
    }
    if (args.content === undefined || args.content === null) {
      return createMCPResponse('error', null, 'content is required');
    }

    const requestData = {
      authenticationToken: tokenData.accessToken,
      title: args.title,
      content: toEnml(args.content),
      notebookGuid: args.notebookGuid || undefined,
      tagNames: (args.tagNames && args.tagNames.length > 0) ? args.tagNames : undefined,
    };

    console.error('🌐 Calling Evernote createNote API with title:', args.title);
    const createdNote = await makeNoteStoreRequest('createNote', requestData, tokenData);

    console.error('✅ Note created:', createdNote.guid);

    return createMCPResponse('success', {
      guid: createdNote.guid,
      title: createdNote.title,
      created: new Date(createdNote.created).toISOString(),
      notebookGuid: createdNote.notebookGuid || null,
    });

  } catch (error) {
    console.error('❌ createNote error:', error.message);

    let errorMessage;
    if (error.message.includes('INVALID_AUTH') || error.message.includes('AUTH_EXPIRED')) {
      errorMessage = 'Evernote authentication failed. Please re-authenticate by running the server standalone.';
    } else if (error.message.includes('QUOTA_REACHED')) {
      errorMessage = 'Evernote storage quota exceeded.';
    } else if (error.message.includes('ENML_VALIDATION')) {
      errorMessage = 'Note content failed ENML validation.';
    } else if (error.message.includes('RATE_LIMIT_REACHED')) {
      errorMessage = 'Evernote API rate limit reached. Please try again later.';
    } else if (error.message.includes('network') || error.message.includes('ENOTFOUND')) {
      errorMessage = 'Network error connecting to Evernote. Please check your internet connection.';
    } else {
      errorMessage = `Failed to create note: ${error.message}`;
    }

    return createMCPResponse('error', null, errorMessage);
  }
}

module.exports = { createNote };
