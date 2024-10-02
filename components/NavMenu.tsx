'use client';

import { createClient } from "@/utils/supabase/client";
import { Burger, Drawer, Flex, Button } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useRouter } from "next/navigation";

const NavMenu = () => {
    const [opened, { open, close, toggle }] = useDisclosure(false);
    const router = useRouter();

    const logout = () => {
      const supabase = createClient();
      supabase.auth.signOut().then(() => {
        router.push('/login');
      });
    }

    const goToClients = () => {
      console.log('goToClients');
      router.push('/clients');
      close();
    }

    const goToHome = () => {
      console.log('goToHome');
      router.push('/home');
      close();
    }

    const goToBenchmarks = () => {
        router.push('/benchmarks');
        close();
    }

    const goToActivities = () => {
        router.push('/activities');
        close();
    }

    const goToSchedules = () => {
        router.push('/schedules');
        close();
    }
    
    return (
        <div>
        <Burger opened={opened} onClick={open} aria-label="Toggle navigation" />
          <Drawer opened={opened} onClose={close} size="xs" h="${windowHeight}">
            <Flex direction="column" justify="space-between" gap="xs">
                <Flex direction="column" gap="xs">
                  <Button variant="outline" onClick={goToHome}>Home</Button>
                  <Button variant="outline" onClick={goToClients}>Clients</Button>
                  <Button variant="outline" onClick={goToActivities}>Activities</Button>
                  <Button variant="outline" onClick={goToBenchmarks}>Benchmarks</Button>
                  <Button variant="outline" onClick={goToSchedules}>Schedules</Button>
                </Flex>
                <Flex direction="column" gap="xs">
                  <Button variant="outline" onClick={logout}>Logout</Button>
                </Flex>
            </Flex>
          </Drawer>
        </div>
    );
};

export default NavMenu;