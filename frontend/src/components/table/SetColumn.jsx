export const setColumn = ({
  title,
  key,
  align = "center",
  editable = false,
  max,
  min,
  type,
  render,
  children,
  onCell,
  width,
}) => {
  return {
    title,
    dataIndex: key,
    key,
    align,
    editable,
    max,
    min,
    type,
    render,
    children,
    onCell,
    width,
  };
};
