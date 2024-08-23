import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
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
  const user = userEvent.setup();

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

    await user.click(showButton);

    expect(urlDiv).toBeVisible();
    expect(likesButton).toBeVisible();
  });
  test('Checking if the Like Handler is Called Properly', async () => {
    const likesButton = await screen.findByText('69');

    await user.click(likesButton);
    await user.click(likesButton);

    expect(mockHandler.mock.calls).toHaveLength(2);
  });
  test('Checking if the Delete Handler is Called Properly', async () => {
    const deleteButton = await screen.findByText('delete');

    await user.click(deleteButton);
    await user.click(deleteButton);

    expect(mockHandler.mock.calls).toHaveLength(2);
  });
  test('Checking if the Delete Button is Visible If Username matches CurrentUser', async () => {
    const deleteButton = await screen.findByText('delete');
    const showButton = await screen.findByText('show');

    await user.click(showButton);

    expect(deleteButton).toBeVisible();
  });
  test('Checking if the Delete Button is hidden If Username doesn\'t match CurrentUser', async () => {
    cleanup();
    const wrongTestUser = {
      username: 'testr',
    };

    render(<Blog
      blog={testBlog}
      handleLikes={mockHandler}
      handleDelete={mockHandler}
      currentUser={wrongTestUser}
    />);

    const deleteButton = await screen.findByText('delete');
    const showButton = await screen.findByText('show');

    await user.click(showButton);

    expect(deleteButton).not.toBeVisible();
  });

  afterEach(async () => {
    mockHandler.mockClear();
    cleanup();
  });
});
