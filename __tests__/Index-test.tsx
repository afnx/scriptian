import { render } from "@testing-library/react-native";

import Index from "@/src/app/index";

describe("<Index />", () => {
  test("Text renders correctly on Index", () => {
    const { getByText } = render(<Index />);

    getByText("Scriptian Browser");
  });
});
