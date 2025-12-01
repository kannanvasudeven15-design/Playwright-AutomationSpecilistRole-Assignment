# Page snapshot

```yaml
- generic [ref=e3]:
  - generic [ref=e4]:
    - button "Home" [ref=e5] [cursor=pointer]
    - strong [ref=e6]: XYZ Bank
  - generic [ref=e8]:
    - generic [ref=e9]:
      - button "Add Customer" [ref=e10] [cursor=pointer]
      - button "Open Account" [active] [ref=e11] [cursor=pointer]: Open Account
      - button "Customers" [ref=e13] [cursor=pointer]
    - form [ref=e17]:
      - generic [ref=e18]:
        - generic [ref=e19]: "Customer :"
        - combobox [ref=e20]:
          - option "---Customer Name---" [selected]
          - option "Hermoine Granger"
          - option "Harry Potter"
          - option "Ron Weasly"
          - option "Albus Dumbledore"
          - option "Neville Longbottom"
      - generic [ref=e21]:
        - generic [ref=e22]: "Currency :"
        - combobox [ref=e23]:
          - option "---Currency---" [selected]
          - option "Dollar"
          - option "Pound"
          - option "Rupee"
      - button "Process" [ref=e24] [cursor=pointer]
```