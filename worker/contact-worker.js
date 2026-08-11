/**
 * Cloudflare Worker: contact form -> email (with attachments) via Resend
 * ------------------------------------------------------------------
 * Receives a multipart/form-data POST from the portfolio contact form,
 * parses the text fields and any uploaded files, and sends it all as a
 * single email (with the files as real attachments) to
 * petereluwade55@gmail.com using the Resend API.
 *
 * Required setup (see WORKER_DEPLOYMENT.md for full step-by-step):
 *   - A Resend account + verified sending domain (or their onboarding
 *     "resend.dev" sender for testing)
 *   - RESEND_API_KEY set as a Cloudflare Worker secret (never hardcode it)
 *
 * This file has no build step - it's a single ES module Worker.
 */

const TO_EMAIL = 'petereluwade55@gmail.com';
const FROM_EMAIL = 'Portfolio Contact Form <onboarding@resend.dev>'; // update once a custom domain is verified in Resend
const MAX_TOTAL_ATTACHMENT_BYTES = 10 * 1024 * 1024; // 10MB combined, matches the form's own client-side check

// Restrict which origins are allowed to call this Worker.
// IMPORTANT: an Origin header from the browser NEVER includes a trailing
// slash or a path (e.g. "https://peterlightspeed.github.io", not
// ".../portfolio/" or a trailing "/") — a mismatch here silently breaks
// CORS: the request still reaches this Worker and still sends the email,
// but the browser blocks the page from reading the response, so the form
// shows an error even though the message actually went through.
const ALLOWED_ORIGINS = [
    'http://127.0.0.1:5500',
    'http://localhost:5500',
    'https://peterlightspeed.github.io',
];

function corsHeaders(origin) {
    const headers = {
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
    };

    if (ALLOWED_ORIGINS.includes(origin)) {
        headers['Access-Control-Allow-Origin'] = origin;
    }

    return headers;
}

function jsonResponse(body, status, origin) {
    return new Response(JSON.stringify(body), {
        status,
        headers: {
            'Content-Type': 'application/json',
            ...corsHeaders(origin),
        },
    });
}

// Convert an ArrayBuffer to a base64 string (Resend expects base64 attachment content)
function arrayBufferToBase64(buffer) {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const chunkSize = 0x8000;
    for (let i = 0; i < bytes.length; i += chunkSize) {
        binary += String.fromCharCode.apply(null, bytes.subarray(i, i + chunkSize));
    }
    return btoa(binary);
}

// Fields that are actual files (must match the `name` attributes in contact.html)
const FILE_FIELD_NAMES = ['logoUpload', 'backgroundImages', 'additionalFiles'];

function escapeHtml(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

export default {
    async fetch(request, env) {
        const origin = request.headers.get('Origin') || '';

        // Handle CORS preflight
        if (request.method === 'OPTIONS') {
            return new Response(null, { status: 204, headers: corsHeaders(origin) });
        }

        if (request.method !== 'POST') {
            // Simple self-diagnostic for GET requests: visit this Worker's
            // URL directly in a browser to confirm (a) this exact code is
            // actually what's deployed, and (b) whether the origin you're
            // visiting from is currently whitelisted. Doesn't touch email
            // sending or expose secrets — read-only, for troubleshooting.
            if (request.method === 'GET') {
                return jsonResponse(
                    {
                        status: 'ok',
                        message: 'Contact form Worker is live and reachable.',
                        yourOrigin: origin || '(none sent — direct browser visits often omit Origin, that\'s normal)',
                        yourOriginIsAllowed: ALLOWED_ORIGINS.includes(origin),
                        allowedOrigins: ALLOWED_ORIGINS,
                        note: 'If yourOriginIsAllowed is false when you load your actual site (not this direct visit) and submit the form, that mismatch is why the form shows an error even when the email sends. Update ALLOWED_ORIGINS above and redeploy.',
                    },
                    200,
                    origin
                );
            }
            return jsonResponse({ success: false, error: 'Method not allowed' }, 405, origin);
        }

        try {
            const formData = await request.formData();

            // --- Separate text fields from file fields ---
            const textFields = [];
            const attachments = [];
            let totalAttachmentBytes = 0;

            for (const [key, value] of formData.entries()) {
                if (FILE_FIELD_NAMES.includes(key) && value instanceof File) {
                    if (value.size === 0) continue; // empty file input, skip
                    totalAttachmentBytes += value.size;
                    if (totalAttachmentBytes > MAX_TOTAL_ATTACHMENT_BYTES) {
                        return jsonResponse(
                            { success: false, error: 'Total attachment size exceeds 10MB.' },
                            400,
                            origin
                        );
                    }
                    const buffer = await value.arrayBuffer();
                    attachments.push({
                        filename: value.name,
                        content: arrayBufferToBase64(buffer),
                    });
                } else if (!(value instanceof File)) {
                    textFields.push([key, value]);
                }
            }

            // --- Build the email body from the text fields ---
            const rows = textFields
                .filter(([key]) => key !== 'submission_time')
                .map(([key, value]) => `<tr><td style="padding:4px 12px;font-weight:600;">${escapeHtml(key)}</td><td style="padding:4px 12px;">${escapeHtml(value)}</td></tr>`)
                .join('');

            const submissionTime = textFields.find(([key]) => key === 'submission_time');

            const userAgent = request.headers.get('User-Agent') || 'Unknown';
const originSite = request.headers.get('Origin') || 'Unknown';

const attachmentList = attachments.length
    ? attachments.map(file => `<li>${escapeHtml(file.filename)}</li>`).join('')
    : '<li>No attachments</li>';

const html = `
<div style="font-family:Arial,sans-serif;max-width:700px;margin:auto;padding:20px">

<h2>New Portfolio Contact Form Submission</h2>

<table style="border-collapse:collapse;width:100%">
${rows}
</table>

<hr>

<h3>Submission Details</h3>

<table style="width:100%;border-collapse:collapse">

<tr>
<td><strong>Website</strong></td>
<td>Peter Lightspeed Portfolio</td>
</tr>

<tr>
<td><strong>Submitted</strong></td>
<td>${escapeHtml(submissionTime ? submissionTime[1] : new Date().toISOString())}</td>
</tr>

<tr>
<td><strong>Origin</strong></td>
<td>${escapeHtml(originSite)}</td>
</tr>

<tr>
<td><strong>Browser / Device</strong></td>
<td>${escapeHtml(userAgent)}</td>
</tr>

<tr>
<td><strong>Attachments</strong></td>
<td>
<ul>
${attachmentList}
</ul>
</td>
</tr>

</table>

<hr>

<p style="color:#777;font-size:12px">
Generated automatically by Peter Lightspeed Portfolio Contact System
</p>

</div>
`;

            const firstName = String(formData.get("firstName") || "");
            const lastName = String(formData.get("lastName") || "");
            const fullName = `${firstName} ${lastName}`.trim();

            const senderEmail = String(formData.get("email") || "");
            const projectType = String(formData.get("projectType") || "General Inquiry");

            const emailPayload = {
                from: FROM_EMAIL,
                reply_to: senderEmail, 
                to: [TO_EMAIL],
                subject: `[Portfolio] ${projectType} | ${fullName}`,
                html,
                attachments: attachments.length ? attachments : undefined,
            };
                        const resendResponse = await fetch('https://api.resend.com/emails', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${env.RESEND_API_KEY}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(emailPayload),
            });

            if (!resendResponse.ok) {
                const errText = await resendResponse.text();
                console.error('Resend API error:', errText);
                return jsonResponse(
                    { success: false, error: 'Failed to send email. Please try again shortly.' },
                    502,
                    origin
                );
            }

            return jsonResponse({ success: true }, 200, origin);
        } catch (err) {
            console.error('Worker error:', err);
            return jsonResponse({ success: false, error: 'Unexpected server error.' }, 500, origin);
        }
    },
};
