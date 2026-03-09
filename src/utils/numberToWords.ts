const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
  'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

function convertChunk(n: number): string {
  if (n === 0) return '';
  if (n < 20) return ones[n];
  if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? ' ' + ones[n % 10] : '');
  return ones[Math.floor(n / 100)] + ' Hundred' + (n % 100 ? ' and ' + convertChunk(n % 100) : '');
}

export function numberToWordsINR(amount: number): string {
  if (amount === 0) return 'Zero Rupees';
  
  const num = Math.round(amount);
  if (num < 0) return 'Minus ' + numberToWordsINR(-num);

  // Indian numbering: crore, lakh, thousand, hundred
  const crore = Math.floor(num / 10000000);
  const lakh = Math.floor((num % 10000000) / 100000);
  const thousand = Math.floor((num % 100000) / 1000);
  const remainder = num % 1000;

  let result = '';
  if (crore) result += convertChunk(crore) + ' Crore ';
  if (lakh) result += convertChunk(lakh) + ' Lakh ';
  if (thousand) result += convertChunk(thousand) + ' Thousand ';
  if (remainder) result += convertChunk(remainder);

  return result.trim() + ' Rupees Only';
}
