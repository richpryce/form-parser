import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import FormUpload from "./FormUpload";
import AWS from "aws-sdk";
import "@testing-library/jest-dom/extend-expect";

jest.mock("aws-sdk", () => {
  return {
    S3: jest.fn().mockImplementation(() => {
      return {
        upload: () => ({
          promise: jest.fn().mockResolvedValue({}),
        }),
      };
    }),
    config: {
      update: jest.fn(),
    },
  };
});

describe("FormUpload component", () => {
  test("renders the component", () => {
    render(<FormUpload />);
    expect(screen.getByText("Upload a Scanned Form")).toBeInTheDocument();
    expect(screen.getByLabelText("Upload")).toBeInTheDocument();
  });

  test("file input change triggers the upload function", async () => {
    const { getByLabelText } = render(<FormUpload />);
    const input = getByLabelText("Upload") as HTMLInputElement;

    const file = new File(["sample"], "sample.png", {
      type: "image/png",
    });

    Object.defineProperty(input, "files", {
      value: [file],
    });

    fireEvent.change(input);

    expect(AWS.S3).toHaveBeenCalled();
  });
});
