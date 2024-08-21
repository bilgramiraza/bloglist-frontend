import { beforeEach, describe, expect, test, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Blog from './Blog';
import userEvent from '@testing-library/user-event';

describe('<Blog />', () => {
  let container;
  const testBlog = {
    title: 'test',
    author: 'tester',
    url: 'test.com',
    likes: '69',
    user: {
      username: 'tester',
    }
  };
  const testUser = {
    username: 'tester',
  };

  const mockHandler = vi.fn();

  beforeEach(() => {
    container = render(<Blog
      blog={testBlog}
      handleLikes={mockHandler}
      handleDelete={mockHandler}
      currentUser={testUser}
    />).container;

  });
  test('Renders only Blog Title and Author on initial Render', async () => {
    const titleDiv = await screen.findByText('test');
    const authorDiv = await screen.findByText('-tester');

    const urlDiv = await screen.findByText('test.com');
    const likesButton = await screen.findByText('69');

    expect(titleDiv).toBeVisible();
    expect(authorDiv).toBeVisible();

    expect(urlDiv).not.toBeVisible();
    expect(likesButton).not.toBeVisible();
  });
  test('Renders Blog URL and Likes after \'show\' button is clicked', async () => {
    const urlDiv = await screen.findByText('test.com');
    const likesButton = await screen.findByText('69');
    const showButton = await screen.findByText('show');

    const user = userEvent.setup();
    await user.click(showButton);

    expect(urlDiv).toBeVisible();
    expect(likesButton).toBeVisible();
  });
});
