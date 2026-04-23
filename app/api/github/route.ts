import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const GITHUB_GRAPHQL_API = 'https://api.github.com/graphql';

const query = `
  query($username: String!) {
    user(login: $username) {
      contributionsCollection {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              contributionCount
              date
              color
            }
          }
        }
      }
    }
  }
`;

export async function GET() {
  const token = process.env.GITHUB_TOKEN;

  if (!token) {
    return NextResponse.json({ error: 'GITHUB_TOKEN is not defined' }, { status: 500 });
  }

  try {
    const socials = JSON.parse(await fs.readFile(path.join(process.cwd(), 'content', 'socials.json'), 'utf-8'));
    const githubUrl = socials.github?.url || '';
    const username = githubUrl.split('/').pop() || 'D-Seonay';

    const response = await fetch(GITHUB_GRAPHQL_API, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables: { username },
      }),
    });

    if (!response.ok) {
      throw new Error(`GitHub API responded with status ${response.status}`);
    }

    const data = await response.json();

    if (data.errors) {
      return NextResponse.json({ errors: data.errors }, { status: 400 });
    }

    const calendar = data.data.user.contributionsCollection.contributionCalendar;

    return NextResponse.json({
      totalContributions: calendar.totalContributions,
      weeks: calendar.weeks,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
