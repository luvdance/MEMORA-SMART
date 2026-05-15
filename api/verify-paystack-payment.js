export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { reference } = req.body;

  if (!reference) {
    return res.status(400).json({ error: "Reference required" });
  }

  try {
    const response = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();

    if (!data.status || data.data?.status !== "success") {
      return res.status(400).json({
        verified: false,
        message: "Payment not successful",
      });
    }

    return res.status(200).json({
      verified: true,
      amount: data.data.amount / 100, // kobo to naira
      currency: data.data.currency,
      email: data.data.customer?.email,
      reference: data.data.reference,
      purchaseType: data.data.metadata?.purchase_type || "single_cv",
    });

  } catch (err) {
    console.error("Verification error:", err);
    return res.status(500).json({ error: "Verification failed" });
  }
}