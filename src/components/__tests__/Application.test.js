import React from "react";
import axios from "axios";
import { render, cleanup, getByText, waitForElement, fireEvent, prettyDOM, getAllByTestId, getByAltText, getByPlaceholderText, queryByText, queryByAltText } from "@testing-library/react";

import Application from "components/Application";

afterEach(cleanup);

describe("Application", () => {

  it('defaults to Monday and changes the schedule when a new day is selected', () => {
    const { getByText } = render(<Application />)

    return waitForElement(() => getByText('Monday')).then(() => {
      fireEvent.click(getByText('Tuesday'))
      expect(getByText('Leopold Silvers')).toBeInTheDocument()
    })
  });

  it('loads data, cancels an interview and increases the spots remaining for Monday by 1', async () => {
    // Render the application
    const { container } = render(<Application />);
    // Wait until text "Archie Cohen" is displayed
    await waitForElement(() => getByText(container, "Archie Cohen"));
    // Click trash symbol button on first appointment
    const appointment = getAllByTestId(container, "appointment").find(
      appointment => queryByText(appointment, "Archie Cohen")
    );
    fireEvent.click(queryByAltText(appointment, "Delete"));
    // Check confirmation message is shown
    expect(getByText(appointment, "Are you sure you want to cancel?")).toBeInTheDocument();
    // Click confirm to cancel appointment
    fireEvent.click(getByText(appointment, "Confirm"));
    // Check that element with text "Canceling" is displayed
    expect(getByText(appointment, "Canceling")).toBeInTheDocument();
    // Wait until element with Add button is displayed
    await waitForElement(() => getByAltText(appointment, "Add"));
    // Check that DayListItem for Monday has text "2 spots remaining"
    const day = getAllByTestId(container, "day").find(day =>
      queryByText(day, "Monday")
    );
    expect(getByText(day, /2 spots remaining/i)).toBeInTheDocument();
  });

  it('loads data, edits an interview, and keeps the spots remaining for Monday the same', async () => {
    // Render application
    const { container } = render(<Application />);
    // Wait until text "Archie Cohen" is displayed
    await waitForElement(() => getByText(container, "Archie Cohen"));
    // Click edit button
    const appointment = getAllByTestId(container, "appointment").find(
      appointment => queryByText(appointment, "Archie Cohen")
    );
    fireEvent.click(queryByAltText(appointment, "Edit"));
    // Edit appointment by changing name and selecting different interviewer
    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Lydia Miller-Jones" }
    });
    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));
    // Click save to save new inputs
    fireEvent.click(getByText(appointment, "Save"));
    // Check that "saving is displayed"
    expect(getByText(appointment, "Saving")).toBeInTheDocument();
    // Wait for element with new student name to be displayed
    await waitForElement(() => getByText(container, "Lydia Miller-Jones"));
    // check interviewer has changed to the new one selected
    expect(getByText(container, "Sylvia Palmer")).toBeInTheDocument();
    // Check spots remaining is still 1
    const day = getAllByTestId(container, "day").find(day =>
      queryByText(day, "Monday")
    );
    expect(getByText(day, /1 spot remaining/i)).toBeInTheDocument();
  });

  it("shows the save error when failing to save an appointment", async () => {
    axios.put.mockRejectedValueOnce();
    // Render application
    const { container } = render(<Application />);
    // Wait until text "Archie Cohen" is displayed
    await waitForElement(() => getByText(container, "Archie Cohen"));
    // Add appointment
    const appointments = getAllByTestId(container, "appointment");
    const appointment = appointments[0];
    fireEvent.click(getByAltText(appointment, "Add"));
    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Lydia Miller-Jones" }
    });
    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));
    // Click save to save new apppointment
    fireEvent.click(getByText(appointment, "Save"));
    // Check that "saving is displayed"
    expect(getByText(appointment, "Saving")).toBeInTheDocument();
    // wait for error message
    await waitForElement(() => getByText(appointment, "Error"))
    // close error message
    fireEvent.click(queryByAltText(appointment, "Close"));
    // check book appointment view is still showing and spots remaining are the same
    expect(getByText(appointment, "Save")).toBeInTheDocument();
    const day = getAllByTestId(container, "day").find(day =>
      queryByText(day, "Monday")
    );
    expect(getByText(day, /1 spot remaining/i)).toBeInTheDocument();
  });

  it("shows the delete error when failing to delete an appointment", async () => {
    axios.delete.mockRejectedValueOnce();
    // Render the application
    const { container } = render(<Application />);
    // Wait until text "Archie Cohen" is displayed
    await waitForElement(() => getByText(container, "Archie Cohen"));
    // Click trash symbol button on first appointment
    const appointment = getAllByTestId(container, "appointment").find(
      appointment => queryByText(appointment, "Archie Cohen")
    );
    fireEvent.click(queryByAltText(appointment, "Delete"));
    // Check confirmation message is shown
    expect(getByText(appointment, "Are you sure you want to cancel?")).toBeInTheDocument();
    // Click confirm to cancel appointment
    fireEvent.click(getByText(appointment, "Confirm"));
    // Check that element with text "Canceling" is displayed
    expect(getByText(appointment, "Canceling")).toBeInTheDocument();
    // wait for Error message
    await waitForElement(() => getByText(appointment, "Error"));
  });

  // booking this interview affects the spots remaining for other tests, so it is last
  it('loads data, books an interview and reduces the spots remaining for the first day by 1', async () => {
    const { container } = render(<Application />);
    await waitForElement(() => getByText(container, "Archie Cohen"));

    const appointments = getAllByTestId(container, "appointment");
    const appointment = appointments[0];

    fireEvent.click(getByAltText(appointment, "Add"));
    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Lydia Miller-Jones" }
    });
    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));
    fireEvent.click(getByText(appointment, "Save"));
    expect(getByText(appointment, "Saving")).toBeInTheDocument();
    await waitForElement(() => getByText(appointment, "Lydia Miller-Jones"));

    const day = getAllByTestId(container, "day").find(day =>
      queryByText(day, "Monday")
    );
    expect(getByText(day, /no spots remaining/i)).toBeInTheDocument();
  });
});
