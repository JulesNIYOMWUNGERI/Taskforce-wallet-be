# Wallet Management Application


## Project Overview

This Wallet Management Application is designed to help users effortlessly manage their finances by organizing transactions, monitoring expenses, and gaining valuable insights. 


### Before diving deep into the project, here are some important URLs to access different parts of the project:
- Frontend repository link: 
    - https://github.com/JulesNIYOMWUNGERI/Taskforce-wallet-fe
- Hosted frontend link: 
    - https://wallet-management-five.vercel.app/
- Backend repository link: 
    - https://github.com/JulesNIYOMWUNGERI/Taskforce-wallet-be
- Hosted backend link:
    - https://wallet-management-api-unf0.onrender.com/docs

### Note that:
- Backend is hosted on Render 
- Frontend is hosted on vercel

Below is an overview of what to expect from the project: 


### Functionalities
#### 1. Account Management

- Add, view, edit, and delete an accounts (e.g., bank accounts, mobile wallets, cash).

#### 2. Transaction Tracking

- Record income and expenses with detailed information, including dates, amounts, and associated accounts.
- Organize transactions by categories and subcategories for better financial analysis.
- Filter transactions by date range (start date and end date).

#### 3. Categories and Subcategories

- Create and manage categories and subcategories for a more granular view of expenses and income.
- Link transactions to specific categories or subcategories.

#### 4. Budget Management

- Set budget limits and receive notifications when your expenses exceed the set budget.

#### 5. Financial Reports

- Generate PDF reports for income, expenses, and overall financial performance within a given date range.
- View summarized data, including total income, total expenses, and account balances.

#### 6. Visual Insights

- Display financial data in tables for better visualization of spending habits and trends.

#### 7. Notifications

- Get notified when budgets are exceeded to keep your spending in check.




### How to Start the Project
#### Prerequisites

Ensure you have the following installed on your system:

1. Node.js (v18 or higher)
2. Yarn
3. PostgreSQL (for database management)

#### Installation Steps

Follow these steps to get the backend project running:

1. Clone the Repository by running:
    - git clone "backend repository url"
        - BE repository url ex: https://github.com/JulesNIYOMWUNGERI/Taskforce-wallet-be.git
    - cd "project name (Taskforce-wallet-be)"

2. Install Dependencies by running:
    - yarn install

3. Set Up BackEnd Environment Variables, create .env file in the root folder of the project add the following
    - example of .env:
        - PORT=
        - DB_PORT=
        - DB_HOST=
        - DB_USER=
        - DB_PASSWORD=
        - DB_NAME=
        - NODE_ENV=
        - DB_SYNCHRONIZE=true
        - DB_SSL=false
        - JWT_SECRET=your-jwt-secret
        - JWT_EXPIRES_IN=40000000
        - BCRYPT_SALT_ROUNDS=10

4. Start Backend by running:
    - yarn start:dev


Follow these steps to get the frontend project running:

1. Clone the Repository by running:
    - git clone "frontend repository url"
        - FE repository url ex: https://github.com/JulesNIYOMWUNGERI/Taskforce-wallet-fe.git
    - cd "project name (Taskforce-wallet-fe)"

2. Install Dependencies by running:
    - yarn install

3. Set Up FrontEnd Environment Variables, create .env file in the root folder of the project add the following
    - example of .env:
        - VITE_PUBLIC_DEFAULT_API=

4. Start the Frontend by running:
    - yarn dev

#### Access the Application

Open your browser and visit:

    - Frontend: http://localhost:{port}
    - Backend API: http://localhost:{port}/docs

## How to use the application
### Frontend

#### Landing page:
- After successfully starting both the backend and frontend projects, navigate to the frontend URL. On the landing page, you'll find a welcome header, a brief paragraph introducing the project, and two buttons: one for signing up and the other for logging in.

#### Sign Up page
- If you're visiting the website for the first time, start by signing up with your full name, email, and password. The registration process is quick and does not require account verification. After successfully registering, you will be redirected to the Login page.

#### Sign In page
- On the Login page, simply enter your email and password to sign in. Upon successful login, you will be redirected to the Accounts page.

#### Account page
- On the Accounts page, data is displayed in a table. If you don't have any accounts yet, the table will display a "No Options" message, indicating that no accounts are currently available.

- There is also a "Create Account" button on the Accounts page. Clicking this button opens a popup containing a form for creating a new account.

- After creating accounts, the list of accounts will be displayed in the table, showing basic information along with a "View" button. Clicking the "View" button opens a popup that provides more detailed information about the account, along with two additional buttons: one for updating the account and another for deleting it.

- Each newly created account will have a default balance of 0. As transactions are added, the balance will either increase or decrease depending on the transaction type (income or expenses).

#### Transactions page
- On the Transactions page, data is displayed in a table. If there are no transactions, the table will display a "No Options" message, indicating that no transactions are currently available.

- There is also a "Create Transaction" button for adding a new transaction. Clicking it will open a popup containing a form for creating the transaction. The form includes a category input dropdown, which displays the categories you've created in the Category section, as well as a subcategory input dropdown. The subcategory options will be dynamically populated based on the selected category, as they are related to that category.

-  There is onother button for generating report, which will show a popup for selecting date range and also a button to triger the report generation generate pdf report in that date range

- Each transaction will have a "View" button to display more details. Clicking the button will open a popup showing the transaction details, along with options to update or delete the transaction.

#### Categories page
- On the Category page, there is a table displaying the categories. Each category has buttons to view, edit, and delete the category.

- The "Edit" button will open a form to edit the selected category, while the "Delete" button will remove that specific category.

- The "View" button will open another page displaying a table of subcategories related to that category. On this page, you can update or delete subcategories, as well as create new subcategories specific to that category using a "Create Subcategory" button.

- Of course, on the Category page, there is also a "Create Category" button for adding a new category.

#### Budget setting button and Logout button
- On the side navigation, there is also a "Budget Setting" section. Clicking on it will open a popup displaying the current budget limit, along with an option to update the budget limit.

- Another section, "Logout," in the side navigation will open a popup asking for confirmation to log out, with a button to confirm the logout action.


### Backend
- After starting the backend project, navigate to http://localhost:{port}/docs, where you'll find the Swagger documentation to interact with all the available endpoints.