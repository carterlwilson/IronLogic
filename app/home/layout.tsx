'use client';

import NavMenu from "@/components/NavMenu";
import { createClient } from "@/utils/supabase/client";
import { Burger, Drawer, Flex, Button } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useRouter } from "next/navigation";

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