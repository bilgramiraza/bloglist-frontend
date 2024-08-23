import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
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
      handleNotification={mockHandler}
    />).container;

  });

  test('Testing If Form\'s Submit Button is Disabled on Initial Render', async () => {
    const submitButton = screen.getByRole('button');

    expect(submitButton).toBeDisabled();
  });
  test('Testing If Form Blocks Submission if None of the Fields are filled', async () => {
    const submitButton = screen.getByRole('button');

    await user.click(submitButton);
    expect(mockHandler).not.toHaveBeenCalled()
  });
  test('Testing If Form Blocks Submission if Only Title is provided', async () => {
    const titleInput = container.querySelector('input[name=title]');
    const submitButton = screen.getByRole('button');

    await user.type(titleInput, testBlog.title);
    expect(submitButton).toBeDisabled();
    await user.click(submitButton);
    expect(mockHandler).not.toHaveBeenCalled()
  });
  test('Testing If Form Blocks Submission if Only Author is provided', async () => {
    const authorInput = container.querySelector('input[name=author]');
    const submitButton = screen.getByRole('button');

    await user.type(authorInput, testBlog.author);
    expect(submitButton).toBeDisabled();
    await user.click(submitButton);
    expect(mockHandler).not.toHaveBeenCalled()
  });
  test('Testing If Form Blocks Submission if Only URL is provided', async () => {
    const urlInput = container.querySelector('input[name=url]');
    const submitButton = screen.getByRole('button');

    await user.type(urlInput, testBlog.url);
    expect(submitButton).toBeDisabled();
    await user.click(submitButton);
    expect(mockHandler).not.toHaveBeenCalled()
  });
  test('Testing If Form Blocks Submission if Only Title and Author is provided', async () => {
    const titleInput = container.querySelector('input[name=title]');
    const authorInput = container.querySelector('input[name=author]');
    const submitButton = screen.getByRole('button');

    await user.type(titleInput, testBlog.title);
    await user.type(authorInput, testBlog.author);
    expect(submitButton).toBeDisabled();
    await user.click(submitButton);
    expect(mockHandler).not.toHaveBeenCalled()
  });
  test('Testing If Form Blocks Submission if Only Author and URL is provided', async () => {
    const authorInput = container.querySelector('input[name=author]');
    const urlInput = container.querySelector('input[name=url]');
    const submitButton = screen.getByRole('button');

    await user.type(authorInput, testBlog.author);
    await user.type(urlInput, testBlog.url);
    expect(submitButton).toBeDisabled();
    await user.click(submitButton);
    expect(mockHandler).not.toHaveBeenCalled()
  });
  test('Testing If Form Blocks Submission if Only Title and URL is provided', async () => {
    const titleInput = container.querySelector('input[name=title]');
    const urlInput = container.querySelector('input[name=url]');
    const submitButton = screen.getByRole('button');

    await user.type(titleInput, testBlog.title);
    await user.type(urlInput, testBlog.url);
    expect(submitButton).toBeDisabled();
    await user.click(submitButton);
    expect(mockHandler).not.toHaveBeenCalled()
  });
  test('Testing If Form Blocks Submission if Title, Author and URL is provided but isn\'t Submitted', async () => {
    const titleInput = container.querySelector('input[name=title]');
    const authorInput = container.querySelector('input[name=author]');
    const urlInput = container.querySelector('input[name=url]');
    const submitButton = screen.getByRole('button');

    await user.type(titleInput, testBlog.title);
    await user.type(authorInput, testBlog.author);
    await user.type(urlInput, testBlog.url);
    expect(submitButton).toBeEnabled();
    expect(mockHandler).not.toHaveBeenCalled()
  });
  test('Testing If Form Blocks Submission if None of the Fields are filled, Via Keyboard', async () => {
    const titleInput = container.querySelector('input[name=title]');

    await user.type(titleInput, '{Enter}');
    expect(mockHandler).not.toHaveBeenCalled()
  });
  test('Testing If Form Blocks Submission if Only Title is provided, Via Keyboard', async () => {
    const titleInput = container.querySelector('input[name=title]');
    const submitButton = screen.getByRole('button');

    await user.type(titleInput, testBlog.title);
    expect(submitButton).toBeDisabled();
    await user.type(titleInput, '{Enter}');
    expect(mockHandler).not.toHaveBeenCalled()
  });
  test('Testing If Form Blocks Submission if Only Author is provided, Via Keyboard', async () => {
    const authorInput = container.querySelector('input[name=author]');
    const submitButton = screen.getByRole('button');

    await user.type(authorInput, testBlog.author);
    expect(submitButton).toBeDisabled();
    await user.type(authorInput, '{Enter}');
    expect(mockHandler).not.toHaveBeenCalled()
  });
  test('Testing If Form Blocks Submission if Only URL is provided, Via Keyboard', async () => {
    const urlInput = container.querySelector('input[name=url]');
    const submitButton = screen.getByRole('button');

    await user.type(urlInput, testBlog.url);
    expect(submitButton).toBeDisabled();
    await user.type(urlInput, '{Enter}');
    expect(mockHandler).not.toHaveBeenCalled()
  });
  test('Testing If Form Blocks Submission if Only Title and Author is provided, Via Keyboard', async () => {
    const titleInput = container.querySelector('input[name=title]');
    const authorInput = container.querySelector('input[name=author]');
    const submitButton = screen.getByRole('button');

    await user.type(titleInput, testBlog.title);
    await user.type(authorInput, testBlog.author);
    expect(submitButton).toBeDisabled();
    await user.type(authorInput, '{Enter}');
    expect(mockHandler).not.toHaveBeenCalled()
  });
  test('Testing If Form Blocks Submission if Only Author and URL is provided, Via Keyboard', async () => {
    const authorInput = container.querySelector('input[name=author]');
    const urlInput = container.querySelector('input[name=url]');
    const submitButton = screen.getByRole('button');

    await user.type(authorInput, testBlog.author);
    await user.type(urlInput, testBlog.url);
    expect(submitButton).toBeDisabled();
    await user.type(urlInput, '{Enter}');
    expect(mockHandler).not.toHaveBeenCalled()
  });
  test('Testing If Form Blocks Submission if Only Title and URL is provided, Via Keyboard', async () => {
    const titleInput = container.querySelector('input[name=title]');
    const urlInput = container.querySelector('input[name=url]');
    const submitButton = screen.getByRole('button');

    await user.type(titleInput, testBlog.title);
    await user.type(urlInput, testBlog.url);
    expect(submitButton).toBeDisabled();
    await user.type(urlInput, '{Enter}');
    expect(mockHandler).not.toHaveBeenCalled()
  });
  test('Testing If Form Blocks Submission if Title, Author and URL is provided but isn\'t Submitted, Via Keyboard', async () => {
    const titleInput = container.querySelector('input[name=title]');
    const authorInput = container.querySelector('input[name=author]');
    const urlInput = container.querySelector('input[name=url]');
    const submitButton = screen.getByRole('button');

    await user.type(titleInput, testBlog.title);
    await user.type(authorInput, testBlog.author);
    await user.type(urlInput, testBlog.url);
    expect(submitButton).toBeEnabled();
    expect(mockHandler).not.toHaveBeenCalled()
  });
  test('Testing If Form Allows Submission if all items are filled in', async () => {
    const titleInput = container.querySelector('input[name=title]');
    const authorInput = container.querySelector('input[name=author]');
    const urlInput = container.querySelector('input[name=url]');
    const submitButton = screen.getByRole('button');

    await user.type(titleInput, testBlog.title);
    await user.type(authorInput, testBlog.author);
    await user.type(urlInput, testBlog.url);

    expect(submitButton).toBeEnabled();
    await user.click(submitButton);

    expect(mockHandler).toHaveBeenCalled()
    expect(mockHandler.mock.calls).toHaveLength(1);
  });
  test('Testing If Form Allows Submission if all items are filled in, Via Keyboard', async () => {
    const titleInput = container.querySelector('input[name=title]');
    const authorInput = container.querySelector('input[name=author]');
    const urlInput = container.querySelector('input[name=url]');
    const submitButton = screen.getByRole('button');

    await user.type(titleInput, testBlog.title);
    await user.type(authorInput, testBlog.author);
    await user.type(urlInput, testBlog.url);

    expect(submitButton).toBeEnabled();
    await user.type(urlInput, '{Enter}');

    expect(mockHandler).toHaveBeenCalled()
    expect(mockHandler.mock.calls).toHaveLength(1);
  });
  test('Testing If Form Returns Valid Data via the CreationHandler', async () => {
    const titleInput = container.querySelector('input[name=title]');
    const authorInput = container.querySelector('input[name=author]');
    const urlInput = container.querySelector('input[name=url]');
    const submitButton = screen.getByRole('button');

    await user.type(titleInput, testBlog.title);
    await user.type(authorInput, testBlog.author);
    await user.type(urlInput, testBlog.url);

    expect(submitButton).toBeEnabled();
    await user.click(submitButton);

    expect(mockHandler).toHaveBeenCalled()
    expect(mockHandler.mock.calls[0][0]).toStrictEqual(testBlog);
  });

  afterEach(async () => {
    mockHandler.mockClear();
    cleanup();
  });
});
