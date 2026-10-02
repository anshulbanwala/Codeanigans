# Sentinel — 4–5 Minute Judge Pitch

Good morning everyone. We are Team Codeanigans, and for Theme 1, we built **Sentinel**, a risk, fraud and regulatory intelligence copilot for financial institutions.

Before I show you the product, I want you to imagine something very simple.

Imagine you are a compliance officer at a financial institution and you start your day with hundreds of transactions, multiple fraud alerts, customer information, call notes, regulatory documents and ongoing investigations. Somewhere inside all of this could be a customer deliberately splitting transactions to avoid detection. Somewhere else could be a network of accounts receiving money and immediately withdrawing it as cash. And at the same time, your institution also needs to monitor things like liquidity and large credit exposures.

The problem is not that financial institutions do not have this information. They do.

The problem is that the information is fragmented.

One part may be sitting in transaction systems, another in case management tools, another in spreadsheets, another inside relationship manager call notes, and the regulatory guidance sits somewhere else again.

So when an analyst investigates something suspicious, a large amount of their time is actually spent collecting information and connecting the dots before they can even make a decision.

And this is where we saw an opportunity for AI.

But there is an important catch.

In financial services, you cannot simply put a generic chatbot on top of sensitive data and trust whatever answer it produces. If an AI system tells a compliance officer that a customer looks suspicious, the next questions are immediately going to be, **why do you think that, what data did you use, what regulation supports it, and can I reproduce this decision later?**

That is the problem Sentinel is designed to solve.

Sentinel brings this entire investigation journey into one governed platform built on Snowflake.

When an analyst starts the day, they first land on the **Command Center**. Instead of opening several systems, they get one view of what needs attention. They can see suspicious activity, open investigations, liquidity indicators and credit concentration risk, with the most important items surfaced for review.

Now suppose one of those alerts suggests that money is moving through mule accounts.

For someone unfamiliar with the term, a mule account is simply an account being used to receive and move potentially illicit money on behalf of someone else.

The analyst does not need to know SQL or manually search thousands of transactions. They can simply ask Sentinel something like, **“Show me mule accounts with cash outs after 2 AM.”**

This is where Sentinel becomes more than a dashboard.

Behind that one question is our **Cortex Agent inside Snowflake**. The agent decides what information it needs. It can analyse structured data such as transactions, customers and alerts. It can search unstructured information such as relationship manager call transcripts. And it can search our regulatory corpus to understand what the relevant guidance says.

So instead of giving the analyst a generic AI response, Sentinel can say, here are the transactions I found, here are the customers involved, here are the amounts and timestamps, and here is the regulatory evidence relevant to this pattern.

We deliberately separate **what the data actually proves from what the AI is interpreting**.

And we also show the tools used, the supporting evidence, the generated SQL and the regulatory references. So the analyst can inspect how the answer was produced rather than simply trusting a black box.

From there, the analyst can move directly into an **Investigation**.

Now all of the evidence begins to form one story. They can see the transaction timeline, the customers involved, the alerts that triggered, the connections between entities and even relevant call evidence.

That investigation is then stored as a proper **Case**.

This is important because compliance decisions should not disappear inside a chat conversation. A case becomes the durable record of what happened, who was involved and what evidence supported the investigation.

But we wanted Sentinel to go one step further.

Most AI demonstrations stop once the model produces a good answer.

In the real world, that is often where the actual work begins.

If the analyst determines that the activity is suspicious, someone still has to prepare the regulatory documentation. So Sentinel includes an **STR Factory**. STR stands for Suspicious Transaction Report.

Sentinel takes the evidence already connected to the case and prepares a structured filing pack containing the subjects involved, relevant transactions, grounds for suspicion and supporting regulatory references. It can produce a machine readable JSON version as well as a human readable version for review.

So we are moving from **question, to evidence, to investigation, to regulatory work product** without rebuilding the same story manually at every stage.

There is one more requirement that we considered essential: **auditability**.

Every copilot interaction can be recorded in Sentinel's **Audit Log**. We can see what question was asked, what tools were called, what SQL was generated and which evidence or regulatory sources supported the answer.

So months later, if internal audit, model risk or management asks, **“How did AI contribute to this decision?”**, the institution has something much stronger than “the model told us.”

They have a replayable evidence trail.

We also designed Sentinel to know when **not** to answer.

If someone asks a regulatory question that is outside the information available to Sentinel, it abstains rather than inventing an answer. In a regulated environment, we believe saying **“I don't have sufficient evidence”** is sometimes a much more valuable AI capability than generating another paragraph.

From a technology perspective, Sentinel is built natively around the **Snowflake AI Data Cloud**. We use a semantic layer for structured analytics, Cortex Search for regulatory documents and call transcripts, and a Cortex Agent to orchestrate those capabilities.

We used **CoCo, Snowflake's Cortex Code CLI**, to build and deploy the solution reproducibly. And the same Sentinel agent can be accessed through our own application as well as through **Snowflake CoWork**.

That means we are not maintaining one AI brain for our application and another for Snowflake. It is **one governed agent with multiple ways to access it**.

So what is the business value?

It is not simply that an analyst can chat with their data.

It is that they spend less time searching across systems and more time actually investigating. They can connect structured transactions with unstructured evidence faster. Compliance teams get regulatory outputs without repeatedly rebuilding the same investigation manually. Management gets a clearer view of risk. And audit teams get a traceable record of how AI was used.

Ultimately, Sentinel turns AI from something that **answers questions** into something that helps a regulated team **complete the job**.

From identifying what deserves attention, to understanding why it matters, to investigating the evidence, to preparing the filing, and finally to preserving the entire decision trail.

Our demonstration uses synthetic data, but the operating model is designed around a very real problem.

That is **Sentinel**.

A grounded, evidence first and auditable risk intelligence copilot built on Snowflake.

And now, rather than just telling you what it can do, **let me show you one investigation end to end.**
