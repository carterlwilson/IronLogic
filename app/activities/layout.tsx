import NavMenu from "@/components/NavMenu";

export default function Layout({
    children,
  }: {
    children: React.ReactNode;
  })  {
    return (
        <>
          <NavMenu />
          <main>{children}</main>
        </>
    )
}