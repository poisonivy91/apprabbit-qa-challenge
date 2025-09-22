# Page snapshot

```yaml
- generic [ref=e1]:
  - generic:
    - iframe [ref=e2]:
      - img [ref=f1e3]
    - generic [ref=e4]:
      - generic [ref=e5]:
        - heading "Welcome to AppRabbit" [level=1] [ref=e6]
        - generic [ref=e8]:
          - group [ref=e9]:
            - generic [ref=e10]:
              - textbox "Password" [active] [ref=e11]
              - button "Show Password" [ref=e13] [cursor=pointer]:
                - img [ref=e14] [cursor=pointer]
          - button "Log In" [ref=e17] [cursor=pointer]
        - generic [ref=e18]:
          - button "Back" [ref=e19] [cursor=pointer]
          - paragraph [ref=e20]:
            - link "Forgot password?" [ref=e21] [cursor=pointer]:
              - /url: /forgot-password?appId=8eb45f08-66c1-4ee1-807a-d5b3e75e179f&email=sbowser916@gmail.com
      - img "Horizon UI" [ref=e22]
  - region "top-end Notifications alt+T"
```