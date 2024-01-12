const express = require("express");
const router = express.Router();
const clientController = require("../../controllers/clientController");
const paystack = require("paystack")(`${process.env.PAYSTACK_SECRET_KEY}`);
const awardContestantController = require("../../controllers/awardContestantController");
const handlePaymentQueries = clientController.handlePaymentQueries;

// Endpoint to fetch Paystack authentication URL
router.post("/:id/payment/get-url", async (req, res) => {
  try {
    const contestantId = req.params.id;
    const selectedContestant = await clientController.getSelectedContestant(
      contestantId
    );

    // Extract email and amount from the request body
    const { email, amount } = req.body;

    const paystackTransaction = {
      email: email,
      amount: amount || 10000,
      reference: `vote${selectedContestant.id.replace(
        /\s+/g,
        "__"
      )}${Date.now()}`,
      currency: "NGN",
      callback: `https://bashvoting.onrender.com/paid/callback`,
    };

    const paystackResponse = await paystack.transaction.initialize(
      paystackTransaction
    );

    if (paystackResponse.status && paystackResponse.status === true) {
      // Send Paystack authentication URL to the client side
      console.log("Paystack response:", paystackResponse);
      res.status(200).json({
        authorization_url: paystackResponse.data.authorization_url,
        email: email,
      });
    } else {
      console.error("Invalid Paystack response:", paystackResponse);
      res.status(500).json({ error: "Invalid Paystack Response" });
    }
  } catch (error) {
    console.error("Error processing payment:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Callback endpoint to handle Paystack callback
router.get("/paid/callback", async (req, res) => {
  try {
    const transactionReference = req.query.reference;

    // Extracting contestant id from the transaction reference
    const contestantIdMatch = transactionReference.match(/vote_(\d+)_\d+/);
    const contestantId = contestantIdMatch
      ? parseInt(contestantIdMatch[1])
      : null;

    // Getting the contestant details by id
    const selectedContestant = await getContestantById(contestantId);

    // Verify the Paystack transaction
    const verifyResponse = await paystack.transaction.verify(
      transactionReference
    );

    console.log("Paystack verify response:", verifyResponse);

    if (
      verifyResponse.status &&
      verifyResponse.status === true &&
      verifyResponse.data.currency === "NGN"
    ) {
      // Calculate the number of votes based on the paid amount
      const paidAmount = verifyResponse.data.amount / 100; // Convert from kobo to Naira
      const numberOfVotes = Math.floor(paidAmount / 100); // Assuming N100 per vote

      // Call the handlePaymentQueries function to handle database queries
      await handlePaymentQueries(
        contestantId,
        verifyResponse.data.amount,
        "success"
      );

      // Increment votes for the contestant using the new controller
      await incrementVotesForContestant(contestantId, numberOfVotes);

      console.log("Payment success:", contestantId);
      res.redirect(
        `/voteNowSuccess?status=success&email=${req.query.email}&nickname=${selectedContestant.nickname}&votes=${numberOfVotes}`
      );
    } else {
      // Call the handlePaymentQueries function with 'failed' status
      await handlePaymentQueries(contestantId, 0, "failed");

      console.log("Payment failed:", contestantId);
      res.redirect(
        `/voteNowSuccess?status=failed&email=${req.query.email}&nickname=${selectedContestant.nickname}`
      );
    }
  } catch (error) {
    console.error("Error processing Paystack callback:", error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
