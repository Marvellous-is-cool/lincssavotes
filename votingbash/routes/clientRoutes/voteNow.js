const express = require("express");
const router = express.Router();
const clientController = require("../../controllers/clientController");
const got = require("got");
const connection = require("../../models/connection"); // Import your MySQL connection

// Replace with your actual Flutterwave Secret Key
const flutterwaveSecretKey = "FLWSECK_TEST-2dce25fd88f38b28cc8998a2da505355-X";

router.post("/:nickname/votenow/payment/process", async (req, res) => {
  try {
    const nickname = req.params.nickname;
    const selectedContestant = await clientController.getContestantByNickname(
      nickname
    );
    const { email } = req.body;

    // Construct Flutterwave payment details
    const flutterwavePaymentDetails = {
      tx_ref: `vote_${selectedContestant.nickname}_${Date.now()}`,
      amount: "50",
      currency: "NGN",
      redirect_url: `/contestant/${selectedContestant.nickname}/votenow/payment/callback`,
      meta: {
        consumer_id: Math.floor(Math.random() * 1000) + 1,
        consumer_mac: generateRandomMacAddress(),
      },
      customer: {
        email: email,
      },
      customizations: {
        title: `Payment for ${selectedContestant.nickname}'s vote`,
      },
    };

    // Make a POST request to Flutterwave API using 'got'
    const response = await got
      .post("https://api.flutterwave.com/v3/payments", {
        headers: {
          Authorization: `Bearer ${flutterwaveSecretKey}`,
        },
        json: flutterwavePaymentDetails,
      })
      .json();

    // Save the payment transaction details to the database
    const savePaymentQuery = `
      INSERT INTO payments (contestant_id, transaction_reference, amount, currency, status)
      VALUES (?, ?, ?, ?, ?);
    `;
    await connection.query(savePaymentQuery, [
      selectedContestant.id,
      response.data.tx_ref,
      flutterwavePaymentDetails.amount,
      flutterwavePaymentDetails.currency,
      "pending", // You may set the initial status as "pending"
    ]);

    // Redirect the user to the payment link
    res.redirect(response.data.link);
  } catch (error) {
    // Handle errors
    console.error("Error processing payment:", error);
    if (error.response) {
      console.error("Flutterwave API Error Response:", error.response.body);
      console.error("Status Code:", error.response.statusCode);
      console.error("Headers:", error.response.headers);
    } else if (error.request) {
      console.error("No response received from Flutterwave API");
      console.error("Request details:", error.request.options);
    } else {
      console.error("Error setting up the request:", error.message);
    }
    res.status(500).send("Internal Server Error");
  }
});

function generateRandomMacAddress() {
  const characters = "0123456789ABCDEF";
  let macAddress = "";

  for (let i = 0; i < 12; i++) {
    if (i > 0 && i % 2 === 0) {
      macAddress += "-";
    }

    const randomIndex = Math.floor(Math.random() * characters.length);
    macAddress += characters[randomIndex];
  }

  return macAddress;
}

router.get("/:nickname/votenow/payment/callback", async (req, res) => {
  try {
    const transactionReference = req.query.transaction_id;

    // Verify the Flutterwave transaction
    const response = await got
      .get(
        `https://api.flutterwave.com/v3/transactions/${transactionReference}/verify`,
        {
          headers: {
            Authorization: `Bearer ${flutterwaveSecretKey}`,
          },
        }
      )
      .json();

    // Check if the payment was successful
    if (
      response.data.status === "successful" &&
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
        res.render("voteNowSuccess", {
          selectedContestant,
          paymentSuccess: true,
        });
      } else {
        // Handle the case where payment details are not found
        res.status(400).send("Invalid payment details");
      }
    } else {
      // Update the payment status in the database
      const updatePaymentQuery =
        "UPDATE payments SET status = 'failed' WHERE transaction_reference = ?";
      await connection.query(updatePaymentQuery, [transactionReference]);

      // Inform the customer that their payment was unsuccessful
      res.render("voteNowSuccess", {
        selectedContestant,
        paymentSuccess: false,
      });
    }
  } catch (error) {
    console.error("Error processing Flutterwave callback:", error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
