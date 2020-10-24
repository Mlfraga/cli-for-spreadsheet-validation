export default function formatString(str: string): string {
  const  formattedString = str.normalize("NFD").replace(/[\u0300-\u036f]/g, '').replace(/([^\w]+|\s+)/g, '').toLowerCase();

  return formattedString;
}