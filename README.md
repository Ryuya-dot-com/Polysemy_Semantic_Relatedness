# Polysemy Semantic Relatedness Rating

Static GitHub Pages website for collecting 7-point semantic relatedness
ratings for the trained polysemy and operational-low-relatedness item pairs.

Live site:

<https://ryuya-dot-com.github.io/Polysemy_Semantic_Relatedness/>

## Task

Participants enter their name and participant ID, then rate 20 item pairs on a
1-7 semantic relatedness scale. Item order is randomized with a saved random
seed. At completion, the browser creates an Excel workbook with four sheets:

- `responses`: one row per trial.
- `participant`: participant/session metadata.
- `trial_order`: randomized item order.
- `codebook`: scale and field notes.

No data are uploaded by this static site. The participant must submit the
downloaded file through the study's chosen workflow.

## Deployment

This repository is configured for GitHub Pages from `main` at the repository
root. To update the site, commit changes to:

- `index.html`
- `styles.css`
- `app.js`
- `vendor/xlsx.full.min.js`

## Data Handling

The workbook contains `participant_name` and `participant_id`. Treat downloaded
files as identifiable data unless names are replaced with anonymous codes before
the task is administered.
