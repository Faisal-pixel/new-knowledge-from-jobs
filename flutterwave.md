# 1. Understanding what the "debit_subaccount" property mean in Flutterwave transfer endpoint
The debit_subaccount property in the Flutterwave transfer endpoint specifies the unique ID of the payout subaccount wallet from which funds should be debited for the transfer. 
Key details:
    Purpose: It is used to indicate the specific source of funds when you have multiple subaccounts or wallets and want to make a withdrawal from one of them.
    Requirement: This parameter is required if you choose to use a Payout Subaccount (PSA) as the source of funds for your transfer, rather than your primary Flutterwave balance.
    Value: The value passed should be the unique ID assigned to the payout subaccount when it was created (e.g., PSA******07974).
If this parameter is not specified, Flutterwave will typically debit your default main balance for the transfer. 