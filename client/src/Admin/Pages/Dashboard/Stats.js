import { Text, SimpleGrid, Paper, Group, Title } from '@mantine/core';


function Stats({ data }) {
    return (
        <SimpleGrid cols={4} breakpoints={[{ maxWidth: 'sm', cols: 1 }]}>
            <Title order={3} sx={{ display: 'block' }}>Stats of all time</Title>
            <p></p>
            <p></p>
            <p></p>
            <Paper withBorder radius="md" p="xs">
                <Group>
                    <div>
                        <Text color="dimmed" size="xs" transform="uppercase" weight={700}>
                            Total Users
                        </Text>
                        <Text weight={700} size="xl">
                            {data.totalUsers}
                        </Text>
                    </div>
                </Group>
            </Paper>
            <Paper withBorder radius="md" p="xs">
                <Group>
                    <div>
                        <Text color="dimmed" size="xs" transform="uppercase" weight={700}>
                            Total Posts
                        </Text>
                        <Text weight={700} size="xl">
                            {data.totalPosts}
                        </Text>
                    </div>
                </Group>
            </Paper>
            <Paper withBorder radius="md" p="xs">
                <Group>
                    <div>
                        <Text color="dimmed" size="xs" transform="uppercase" weight={700}>
                            Total Comments
                        </Text>
                        <Text weight={700} size="xl">
                            {data.totalComments}
                        </Text>
                    </div>
                </Group>
            </Paper>
            <Paper withBorder radius="md" p="xs">
                <Group>
                    <div>
                        <Text color="dimmed" size="xs" transform="uppercase" weight={700}>
                            Total Likes
                        </Text>
                        <Text weight={700} size="xl">
                            {data.totalLikes}
                        </Text>
                    </div>
                </Group>
            </Paper>
            <Title order={3} sx={{ display: 'block' }}>Stats of last month</Title>
            <p></p>
            <p></p>
            <p></p>

            <Paper withBorder radius="md" p="xs">
                <Group>
                    <div>
                        <Text color="dimmed" size="xs" transform="uppercase" weight={700}>
                            New Users
                        </Text>
                        <Text weight={700} size="xl">
                            {data.newUsers}
                        </Text>
                    </div>
                </Group>
            </Paper>
            <Paper withBorder radius="md" p="xs">
                <Group>
                    <div>
                        <Text color="dimmed" size="xs" transform="uppercase" weight={700}>
                            New Posts
                        </Text>
                        <Text weight={700} size="xl">
                            {data.newPosts}
                        </Text>
                    </div>
                </Group>
            </Paper>
            <Paper withBorder radius="md" p="xs">
                <Group>
                    <div>
                        <Text color="dimmed" size="xs" transform="uppercase" weight={700}>
                            New Comments
                        </Text>
                        <Text weight={700} size="xl">
                            {data.newComments}
                        </Text>
                    </div>
                </Group>
            </Paper>
            <Paper withBorder radius="md" p="xs">
                <Group>
                    <div>
                        <Text color="dimmed" size="xs" transform="uppercase" weight={700}>
                            New Likes
                        </Text>
                        <Text weight={700} size="xl">
                            {data.newLikes}
                        </Text>
                    </div>
                </Group>
            </Paper>
        </SimpleGrid >
    );
}

export default Stats