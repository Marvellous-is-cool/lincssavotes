// Import necessary modules and libraries
const express = require("express");
const router = express.Router();
const clientController = require("../../controllers/clientController");
const connection = require("../../models/connection");
const axios = require("axios"); // Import the axios library

// Replace with your Paystack public and secret keys
const paystackPublicKey = "pk_test_46bbb2b74c84bbb5d2cba7728e558bd7475d08a9";
const paystackSecretKey = "sk_test_820e317fbabe37837e53b5e7bb54f34c6da49d91";

// Function to get selected contestant details
async function getSelectedContestant(nickname) {
  return await clientController.getContestantByNickname(nickname);
}

// Endpoint to fetch Paystack authentication URL
router.post("/:nickname/votenow/payment/get-url", async (req, res) => {
  try {
    const nickname = req.params.nickname;
    const selectedContestant = await getSelectedContestant(nickname);

    // Initialize Paystack transaction details
    const paystackTransactionDetails = {
      email: req.body.email,
      amount: 5000, // Modify the amount as needed
      reference: `vote_${selectedContestant.nickname}_${Date.now()}`.replace(
        /[^\w_]/g,
        ""
      ),
      currency: "NGN", // Modify the currency as needed
      callback: `https://bashvoting.onrender.com/${selectedContestant.nickname}/votenow/payment/callback`,
    };

    const paystackURL = "https://api.paystack.co/transaction/initialize";

    // Use axios instead of fetch
    const paystackResponse = await axios.post(
      paystackURL,
      paystackTransactionDetails,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${paystackSecretKey}`,
        },
      }
    );

    const responseData = paystackResponse.data;

    if (responseData.data && responseData.data.authorization_url) {
      // Redirect to Paystack authentication URL on the client side
      res.status(200).json({
        authorization_url: responseData.data.authorization_url,
      });
    } else {
      console.error("Invalid Paystack response:", responseData);
      res.status(500).json({ error: "Invalid Paystack Response" });
    }
  } catch (error) {
    console.error("Error processing payment:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Callback endpoint to handle Paystack callback
router.get("/:nickname/votenow/payment/callback", async (req, res) => {
  try {
    console.log("Paystack Callback Request Received:", req.query);
    const nickname = req.params.nickname;
    const selectedContestant = await getSelectedContestant(nickname);

    const transactionReference = req.query.reference;

    const verifyURL = `https://api.paystack.co/transaction/verify/${transactionReference}`;

    // Use axios instead of fetch
    const verifyResponse = await axios.get(verifyURL, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${paystackSecretKey}`,
      },
    });

    const verifyData = verifyResponse.data;

    if (
      verifyData.data.status === "success" &&
      verifyData.data.currency === "NGN"
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
        res.render("voteNowSuccess", {
          selectedContestant,
          status: "success",
        });
      } else {
        res.render("voteNowSuccess", {
          selectedContestant,
          status: "invalid",
        });
      }
    } else {
      const updatePaymentQuery =
        "UPDATE payments SET status = 'failed' WHERE transaction_reference = ?";
      await connection.query(updatePaymentQuery, [transactionReference]);

      // Redirect to the failure page with appropriate query parameters
      res.render("voteNowSuccess", {
        selectedContestant,
        status: "failed",
      });
    }
  } catch (error) {
    console.error("Error processing Paystack callback:", error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
