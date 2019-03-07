// https://docs.cypress.io/api/introduction/api.html

describe('Login', () => {
  before(function () {
    cy.visit('/10ba49f5-faf4-4471-81f5-9e071b8be3a6')
    cy.wait(5000)
  })

  it('Loads the login page', () => {
    cy.get('.header').should('be.visible')
    cy.get('main.contents').should('be.visible')
  })

  it('Changes language to Spanish', () => {
    cy.get('select.select').select('Spanish')
    cy.wait(5000)
    cy.contains('span', 'Actualización de inspección')
    cy.contains('label', 'Por favor ingrese su apellido')
    cy.contains('button', 'Introducir')
  })

  it('Changes language to French', () => {
    cy.get('select.select').select('French')
    cy.wait(5000)
    cy.contains('span', 'Résultats d\'inspection')
    cy.contains('label', 'Veuillez inscrire votre nom de famille')
    cy.contains('button', 'Soumettre')
  })

  it('Changes language to French', () => {
    cy.get('select.select').select('English')
    cy.wait(5000)
    cy.contains('span', 'Vehicle Inspection Update')
    cy.contains('label', 'Please enter your last name')
    cy.contains('button', 'Enter')
  })

  it('Displays error', () => {
    cy.get('button.button.cta').click()
    cy.get('label.error').should('exist')
  })

  it('Disables form after submit', () => {
    cy.get('input.input').type('gary')
    cy.get('button.button.cta').click()
    cy.get('fieldset').should('be.disabled')
  })
})
