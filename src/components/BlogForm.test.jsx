import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import BlogForm from './BlogForm';
import userEvent from '@testing-library/user-event';

describe('<BlogForm />', () => {
  let container;
  const testBlog = {
    title: 'test',
    author: 'tester',
    url: 'test.com',
  };

  const mockHandler = vi.fn();
  const user = userEvent.setup();

  beforeEach(() => {
    container = render(<BlogForm
      handleCreation={mockHandler}
    />).container;

  });

  test('Testing If Form Returns Valid Data via the CreationHandler', async () => {
    const titleInput = container.querySelector('input[name=title]');
    const authorInput = container.querySelector('input[name=author]');
    const urlInput = container.querySelector('input[name=url]');
    const submitButton = screen.getByRole('button');

    await user.type(titleInput, testBlog.title);
    await user.type(authorInput, testBlog.author);
    await user.type(urlInput, testBlog.url);
    await user.click(submitButton);

    expect(mockHandler.mock.calls[0][0]).toStrictEqual(testBlog);
  });

  afterEach(async () => {
    mockHandler.mockClear();
  });
});
