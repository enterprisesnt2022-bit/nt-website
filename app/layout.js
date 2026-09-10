import './globals.css';

export const metadata = {
  title: 'NT Enterprises | Industrial Materials & Technical Solutions',
  description: 'NT Enterprises provides industrial hardware, packaging materials, flexographic printing solutions, doctor blades, ceramic rollers, diaphragms, side packing foam and technical consultancy for industrial applications.'
};

export default function RootLayout({ children }) {
  return <html lang="en"><body>{children}</body></html>;
}
