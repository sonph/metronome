import { fireEvent, within, waitFor } from '@testing-library/dom';

function getSimpleInputForm() {
  // This is just a raw example of setting up some DOM
  // that we can interact with. Swap this with your UI
  // framework of choice 😉
  const div = document.createElement('div')
  div.innerHTML = `
    <label for="username">Username</label>
    <input id="username" />
    <button>Print Username</button>
  `

  const button = div.querySelector('button')
  const input = div.querySelector('input')

  button.addEventListener('click', () => {
    // let's pretend this is making a server request, so it's async
    // (you'd want to mock this imaginary request in your unit tests)...
    setTimeout(() => {
      const printedUsernameContainer = document.createElement('div')
      printedUsernameContainer.innerHTML = `
        <div data-testid="printed-username">${input.value}</div>
      `
      div.appendChild(printedUsernameContainer)
    }, Math.floor(Math.random() * 200))
  })

  // NOTE testing-library doesn't work if element is not mounted to document.
  document.body.appendChild(div)

  return div
}

describe(`Smoke test`, () => {
  test(`jest should run this test`, () => {
    expect(1).not.toEqual(2)
  })

  test(`DOM testing should work`, async () => {
    // To setup test scenario, render something.
    const { getByLabelText, getByTestId, getByText } = within(getSimpleInputForm())

    // Visual assertions
    expect(getByLabelText(/username/i)).toBeInTheDocument() // look for input
    expect(getByText(/print username/i)).toBeInTheDocument() // look for button

    // Act
    fireEvent.change(getByLabelText(/username/i), {
      target: {
        value: 'Quang Tran'
      }
    }); // change input valule
    getByText(/print username/i).click(); // click on button

    // Change assertions
    await waitFor(() => {
      expect(getByTestId(`printed-username`).textContent).toEqual('Quang Tran')
    })
  })
})
