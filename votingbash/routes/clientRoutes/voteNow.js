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
    const selectedContestant = await clientController.getContestantById(
      contestantId
    );

    // Extract email from the request body
    const { email } = req.body;

    const paystackTransaction = {
      email: email,
      amount: 10000,
      reference: `vote__${selectedContestant.id}__${Date.now()}`,
      currency: "NGN",
      callback: `https://bashvoting.onrender.com/paid/callback`,
    };

    console.log("Paystack Transaction:", paystackTransaction); // Log Paystack transaction details

    const paystackResponse = await paystack.transaction.initialize(
      paystackTransaction
    );

    console.log("Paystack Response:", paystackResponse); // Log Paystack API response

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

    console.log("Transaction Reference:", transactionReference); // Log the transaction reference

    // Extracting contestant id from the transaction reference
    const contestantIdMatch = transactionReference.match(/vote__(\d+)__/);
    const contestantId = contestantIdMatch
      ? parseInt(contestantIdMatch[1])
      : null;

    console.log("Extracted Contestant ID:", contestantId); // Log the extracted contestant ID

    // Getting the contestant details by id
    const selectedContestant = await clientController.getContestantById(
      contestantId
    );

    console.log("Selected Contestant:", selectedContestant); // Log selected contestant details

    // Verify the Paystack transaction
    const verifyResponse = await paystack.transaction.verify(
      transactionReference
    );

    console.log("Paystack Verify Response:", verifyResponse); // Log Paystack verification response

    if (
      verifyResponse.status &&
      verifyResponse.status === true &&
      verifyResponse.data.currency === "NGN"
    ) {
      // Calculate the number of votes based on the paid amount
      const paidAmount = verifyResponse.data.amount / 100; // Convert from kobo to Naira
      const numberOfVotes = Math.floor(paidAmount / 100); // Assuming N100 per vote

      // Call the handlePaymentQueries function to handle database queries
      await clientController.handlePaymentQueries(
        contestantId,
        verifyResponse.data.amount,
        "success"
      );

      // Increment votes for the contestant using the new controller
      await clientController.incrementVotesForContestant(
        contestantId,
        numberOfVotes
      );

      console.log("Payment success:", contestantId);
      res.redirect(
        `/voteNowSuccess?status=success&email=${req.query.email}&nickname=${selectedContestant.nickname}&votes=${numberOfVotes}`
      );
    } else {
      // Call the handlePaymentQueries function with 'failed' status
      await clientController.handlePaymentQueries(contestantId, 0, "failed");

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
