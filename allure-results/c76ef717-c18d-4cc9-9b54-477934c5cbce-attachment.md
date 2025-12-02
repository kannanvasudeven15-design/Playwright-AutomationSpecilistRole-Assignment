# Page snapshot

```yaml
- generic [ref=e3]:
  - generic [ref=e4]:
    - button "Home" [ref=e5] [cursor=pointer]
    - strong [ref=e6]: XYZ Bank
    - button "Logout" [ref=e7] [cursor=pointer]
  - generic [ref=e9]:
    - generic [ref=e10]:
      - strong [ref=e11]: Welcome Harry Potter !!
      - combobox [ref=e12]:
        - option "1004" [selected]
        - option "1005"
        - option "1006"
    - generic [ref=e13]:
      - text: "Account Number :"
      - strong [ref=e14]: "1004"
      - text: ", Balance :"
      - strong [ref=e15]: "100"
      - text: ", Currency :"
      - strong [ref=e16]: Dollar
    - generic [ref=e17]:
      - button "Transactions" [ref=e18] [cursor=pointer]
      - button "Deposit" [ref=e19] [cursor=pointer]: Deposit
      - button "Withdrawl" [ref=e21] [cursor=pointer]
    - generic [ref=e23]:
      - text: Deposit Successful
      - form [ref=e24]:
        - generic [ref=e25]:
          - generic [ref=e26]: "Amount to be Deposited :"
          - spinbutton [ref=e27]
        - button "Deposit" [active] [ref=e28] [cursor=pointer]
```