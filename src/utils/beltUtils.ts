export const getBeltColor = (belt: string) => {
  const colors = {
    white: 'bg-gray-100',
    blue: 'bg-blue-500',
    purple: 'bg-purple-500',
    brown: 'bg-amber-800',
    black: 'bg-black',
  };
  return colors[belt as keyof typeof colors] || 'bg-gray-100';
};