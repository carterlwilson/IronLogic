import { MantineProvider } from "@mantine/core";
import '@mantine/core/styles.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <MantineProvider>
          <main>
            {children}
          </main>
        </MantineProvider>
      </body>
    </html>
  );
}
