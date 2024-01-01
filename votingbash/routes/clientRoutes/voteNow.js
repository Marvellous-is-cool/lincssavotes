const express = require("express");
const router = express.Router();
const clientController = require("../../controllers/clientController");
const connection = require("../../models/connection");

// Replace with your Paystack Secret Key
const paystackSecretKey = "sk_test_820e317fbabe37837e53b5e7bb54f34c6da49d91";

const website = process.env.WEB;
const paystack = require("paystack")(paystackSecretKey); // Explicitly require Paystack module

// Function to retrieve selected contestant based on nickname
async function getSelectedContestant(nickname) {
  return await clientController.getContestantByNickname(nickname);
}

router.post("/:nickname/votenow/payment/process", async (req, res) => {
  try {
    const nickname = req.params.nickname;
    const selectedContestant = await getSelectedContestant(nickname);
    const { email } = req.body;

    // Construct Paystack transaction details
    const paystackTransactionDetails = {
      email,
      amount: 5000, // Replace with your desired amount in kobo (e.g., 5000 for ₦50.00)
      reference: `vote_${selectedContestant.nickname}_${Date.now()}`.replace(
        /[^\w_]/g,
        ""
      ), // Remove invalid characters
    };

    // Make a POST request to Paystack API to initialize the transaction
    const response = await paystack.transaction.initialize({
      ...paystackTransactionDetails,
      callback: `https://${website}/${selectedContestant.nickname}/votenow/payment/callback`,
    });

    // Save the payment transaction details to the database
    const savePaymentQuery = `
      INSERT INTO payments (contestant_id, transaction_reference, amount, currency, status)
      VALUES (?, ?, ?, ?, ?);
    `;
    await connection.query(savePaymentQuery, [
      selectedContestant.id,
      response.data.reference,
      paystackTransactionDetails.amount,
      "NGN", // Assuming the currency is NGN
      "pending",
    ]);

    // Send the authorization URL to the client
    res.json({ authorization_url: response.data.authorization_url });
  } catch (error) {
    // Handle errors
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

    // Verify the Paystack transaction
    const response = await paystack.transaction.verify(transactionReference);

    // Check if the payment was successful
    if (
      response.data.status === "success" &&
      response.data.currency === "NGN"
    ) {
      // Update the payment status in the database
      const updatePaymentQuery =
        "UPDATE payments SET status = 'success' WHERE transaction_reference = ?";
      await connection.query(updatePaymentQuery, [transactionReference]);

      // Fetch additional transaction details from the database
      const fetchPaymentQuery =
        "SELECT * FROM payments WHERE transaction_reference = ?";
      const [paymentDetails] = await connection.query(fetchPaymentQuery, [
        transactionReference,
      ]);

      // Proceed with your logic based on the payment details
      if (paymentDetails.length > 0) {
        return res.render("voteNowSuccess", {
          selectedContestant,
          paymentSuccess: true,
        });
      } else {
        // Handle the case where payment details are not found
        return res.status(400).send("Invalid payment details");
      }
    } else {
      // Update the payment status in the database
      const updatePaymentQuery =
        "UPDATE payments SET status = 'failed' WHERE transaction_reference = ?";
      await connection.query(updatePaymentQuery, [transactionReference]);

      // Inform the customer that their payment was unsuccessful
      return res.render("voteNowSuccess", {
        selectedContestant,
        paymentSuccess: false,
      });
    }
  } catch (error) {
    console.error("Error processing Paystack callback:", error);
    return res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
