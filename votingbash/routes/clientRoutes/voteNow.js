const express = require("express");
const router = express.Router();
const clientController = require("../../controllers/clientController");
const connection = require("../../models/connection");

const paystackSecretKey = "sk_test_820e317fbabe37837e53b5e7bb54f34c6da49d91";
const paystack = require("paystack")(paystackSecretKey);

async function getSelectedContestant(nickname) {
  return await clientController.getContestantByNickname(nickname);
}

router.post("/:nickname/votenow/payment/process", async (req, res) => {
  try {
    const nickname = req.params.nickname;
    const selectedContestant = await getSelectedContestant(nickname);
    const { email } = req.body;

    const paystackTransactionDetails = {
      email,
      amount: 5000,
      reference: `vote_${selectedContestant.nickname}_${Date.now()}`.replace(
        /[^\w_]/g,
        ""
      ),
    };

    // Use your local host URL during development
    const callbackURL = `http://localhost:3000/${selectedContestant.nickname}/votenow/payment/callback`;

    // Initialize the Paystack transaction
    const response = await paystack.transaction.initialize({
      ...paystackTransactionDetails,
      callback: callbackURL,
    });

    // Log the entire response for debugging
    console.log("Paystack Transaction Response:", response);

    if (response.data && response.data.reference) {
      // Save payment details to the database
      const savePaymentQuery = `
        INSERT INTO payments (contestant_id, transaction_reference, amount, currency, status)
        VALUES (?, ?, ?, ?, ?);
      `;

      await connection.query(savePaymentQuery, [
        selectedContestant.id,
        response.data.reference,
        paystackTransactionDetails.amount,
        "NGN",
        "pending",
      ]);

      // Redirect the user to Paystack
      res.redirect(response.data.authorization_url);
    } else {
      console.error("Invalid Paystack response:", response);
      res.status(500).json({ error: "Invalid Paystack Response" });
    }
  } catch (error) {
    console.error("Error processing payment:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/:nickname/votenow/payment/callback", async (req, res) => {
  try {
    console.log("Paystack Callback Request Received:", req.query);
    const nickname = req.params.nickname;
    const selectedContestant = await getSelectedContestant(nickname);

    const transactionReference = req.query.reference;

    const response = await paystack.transaction.verify(transactionReference);

    if (
      response.data.status === "success" &&
      response.data.currency === "NGN"
    ) {
      const updatePaymentQuery =
        "UPDATE payments SET status = 'success' WHERE transaction_reference = ?";
      await connection.query(updatePaymentQuery, [transactionReference]);

      // Increment votes for the contestant
      await incrementVotesForContestant(selectedContestant.id);

      const fetchPaymentQuery =
        "SELECT * FROM payments WHERE transaction_reference = ?";
      const [paymentDetails] = await connection.query(fetchPaymentQuery, [
        transactionReference,
      ]);

      if (paymentDetails.length > 0) {
        // Redirect to the success page with appropriate query parameters
        res.redirect(`/nickname/votenow/success?status=success`);
      } else {
        res.redirect(`/nickname/votenow/success?status=invalid`);
      }
    } else {
      const updatePaymentQuery =
        "UPDATE payments SET status = 'failed' WHERE transaction_reference = ?";
      await connection.query(updatePaymentQuery, [transactionReference]);

      // Redirect to the failure page with appropriate query parameters
      res.redirect(`/nickname/votenow/success?status=failed`);
    }
  } catch (error) {
    console.error("Error processing Paystack callback:", error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
