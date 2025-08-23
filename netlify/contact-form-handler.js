// Netlify Edge Function for handling Next.js form submissions
const handler = async (request, context) => {
  if (request.method === 'POST') {
    // Clone the request so we can read the body
    const formData = await request.formData();
    // Forward the form submission to Netlify Forms endpoint
    await fetch('https://forms.netlify.com/submit', {
      method: 'POST',
      body: formData,
    });
    // Optionally, redirect to a thank you page
    return Response.redirect('/contact?success=1', 303);
  }
  // For GET, just continue
  return context.next();
};

export default handler;
