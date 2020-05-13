import React, { useState, useEffect } from 'react'

import moment from 'moment'
import { ChevronDown, ChevronUp } from 'react-feather'

import Amplify from '@aws-amplify/core'
import { API, graphqlOperation } from '@aws-amplify/api'

import { listTodosByDate } from './graphql/queries'
import { createTodo } from './graphql/mutations'

import awsconfig from './aws-exports'
Amplify.configure(awsconfig)

const SORT = {
  ASC: 'ASC',
  DESC: 'DESC',
}

const TODO_DEFAULT = { name: '', description: '', owner: '', dueOn: '' }

function Table({
  todos,
  owner,
  resetOwner,
  sortDirection,
  toggleSortDirection,
}) {
  const isSortingUp = sortDirection === SORT.ASC
  return (
    <div className=" shadow-md rounded px-8 py-6">
      <table className="table-auto w-full text-sm">
        <thead>
          <tr className="border-b">
            <th className="py-2 text-left">
              <div className="flex justify-between">
                <div className="relative flex-grow">
                  <select
                    value={owner}
                    onChange={(e) => resetOwner(e.target.value)}
                    className="w-full bg-gray-200 appearance-none border-2 border-gray-200 rounded py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-orange-500"
                  >
                    <option value="">Select a user</option>
                    <option value="admin">admin</option>
                    <option value="axel">axel</option>
                    <option value="bernice">bernice</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <ChevronDown size={'1rem'} />
                  </div>
                </div>
                <div className="inline-flex ml-6 items-center whitespace-no-wrap sm:hidden">
                  <span>Due On</span>
                  <button
                    onClick={toggleSortDirection}
                    className={`ml-4 bg-orange-500 hover:bg-orange-400 shadow focus:shadow-outline focus:outline-none text-white font-bold p-1 rounded`}
                  >
                    {isSortingUp ? (
                      <ChevronUp size={'1rem'} />
                    ) : (
                      <ChevronDown size={'1rem'} />
                    )}
                  </button>
                </div>
              </div>
            </th>
            <th className="px-8 py-2 text-left hidden sm:table-cell">
              <div className="flex items-center whitespace-no-wrap">
                <span>Due On</span>
                <button
                  onClick={toggleSortDirection}
                  className={`ml-4 bg-orange-500 hover:bg-orange-400 shadow focus:shadow-outline focus:outline-none text-white font-bold p-1 rounded`}
                >
                  {isSortingUp ? (
                    <ChevronUp size={'1rem'} />
                  ) : (
                    <ChevronDown size={'1rem'} />
                  )}
                </button>
              </div>
            </th>
            <th className="py-2 text-left hidden md:table-cell"></th>
          </tr>
        </thead>
        <tbody>
          {todos.map((todo, i) => (
            <tr
              key={todo.id}
              className={`align-top ${i % 2 === 1 ? '' : 'bg-white'}`}
            >
              <td className="p-2 text-left">
                <span className="block text-xs uppercase font-semibold text-gray-500 whitespace-no-wrap">
                  {todo.id}
                </span>
                <span className="sm:hidden text-xs uppercase font-semibold text-gray-500">
                  {moment(todo.dueOn).calendar()} -{' '}
                </span>
                <span>{todo.owner}</span>
              </td>
              <td className="px-8 py-2 text-left hidden sm:table-cell">
                <span className="text-xs uppercase font-semibold text-gray-500">
                  {moment(todo.dueOn).calendar()}
                </span>
              </td>
              <td className="p-2 text-left hidden md:table-cell">
                <span className="text-xs uppercase font-semibold text-gray-500">
                  {todo.name}
                </span>
                <span className="block">{todo.description}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function TodoInput({ todo, setTodo, submit }) {
  const { name, owner, description } = todo
  const onChange = (change) => {
    setTodo((t) => ({ ...t, ...change }))
  }

  const disabled = !name || !description
  return (
    <form
      className="hidden bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
      onSubmit={submit}
    >
      <div className="md:flex md:items-center mb-6">
        <div className="md:w-1/3">
          <label
            className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
            htmlFor="owner"
          >
            Owner
          </label>
        </div>
        <div className="md:w-2/3">
          <input
            className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-orange-500"
            name="owner"
            value={owner}
            onChange={(e) => onChange({ owner: e.target.value })}
          />
        </div>
      </div>
      <div className="md:flex md:items-center mb-6">
        <div className="md:w-1/3">
          <label
            className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
            htmlFor="name"
          >
            Name
          </label>
        </div>
        <div className="md:w-2/3">
          <input
            className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-orange-500"
            name="name"
            value={name}
            onChange={(e) => onChange({ name: e.target.value })}
          />
        </div>
      </div>
      <div className="md:flex  mb-6">
        <div className="md:w-1/3">
          <label
            className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
            htmlFor="description"
          >
            Description
          </label>
        </div>
        <div className="md:w-2/3">
          <textarea
            className="h-32 md:h-20 bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-orange-500"
            name="description"
            value={description}
            onChange={(e) => onChange({ description: e.target.value })}
          />
        </div>
      </div>
      <div className="md:flex md:items-center">
        <div className="md:w-1/3"></div>
        <div className="md:w-2/3">
          <button
            disabled={disabled}
            className={`${
              disabled
                ? 'bg-orange-500 opacity-50 cursor-not-allowed'
                : 'bg-orange-500 hover:bg-orange-400'
            } shadow focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded`}
            type="submit"
          >
            Add
          </button>
        </div>
      </div>
    </form>
  )
}

function TodoNavigate({ isLoading, hasNext, hasPrev, next, prev }) {
  const disabledPrev = !hasPrev || isLoading
  const disabledNext = !hasNext || isLoading
  return (
    <div className="bg-white shadow-md rounded px-8 py-6 my-4 flex justify-between text-sm">
      <button
        className={`${
          disabledPrev
            ? 'bg-orange-500 opacity-50 cursor-not-allowed'
            : 'bg-orange-500 hover:bg-orange-400'
        } shadow focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded`}
        disabled={disabledPrev}
        onClick={prev}
      >
        Previous
      </button>
      <button
        className={`${
          disabledNext
            ? 'bg-orange-500 opacity-50 cursor-not-allowed'
            : 'bg-orange-500 hover:bg-orange-400'
        } shadow focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded`}
        disabled={disabledNext}
        onClick={next}
      >
        Next
      </button>
    </div>
  )
}

function TokenConsole({ limit, nextToken, nextNextToken, previousTokens }) {
  return (
    <div className="font-mono text-sm shadow-md rounded px-8 py-6 mb-8">
      <div className="mb-3 py-2 border-b border-gray-400">
        <div>
          limit: {limit} (number of items to fetch per query; a.k.a page size)
        </div>
      </div>
      <div className="my-3 py-2 border-b border-gray-400">
        <div>nextToken (used in the last query):</div>
        <div className="overflow-x-auto whitespace-no-wrap pt-2 pb-4">
          <ul className="list-disc list-inside">
            <li>
              {nextToken ? (
                <HighlightedToken current={nextToken} />
              ) : (
                <span className="italic">undefined</span>
              )}
            </li>
          </ul>
        </div>
      </div>
      <div className="my-3 pt-2 pb-2 border-b border-gray-400">
        <div>
          Next nextToken (assign to{' '}
          <span className="font-semibold">nextToken</span> when user clicks{' '}
          <span className="font-semibold">Next</span>):
        </div>
        <div className="overflow-x-auto whitespace-no-wrap pt-2 pb-4">
          <ul className="list-disc list-inside">
            <li>
              {nextNextToken ? (
                <HighlightedToken current={nextNextToken} />
              ) : (
                <span className="italic">undefined</span>
              )}
            </li>
          </ul>
        </div>
      </div>
      <div className="my-3 pt-2 pb-2 border-b border-gray-400">
        <div>
          Previous Tokens (pop the last token and assign it to{' '}
          <span className="font-semibold">nextToken</span> when user clicks{' '}
          <span className="font-semibold">Previous</span>):
        </div>
        <div className="overflow-x-auto whitespace-no-wrap pt-2 pb-4">
          <ol className="list-decimal list-inside">
            {previousTokens.map((token, i) => (
              <li key={token || 'undefined'}>
                {token ? (
                  <HighlightedToken
                    previous={previousTokens[i - 1]}
                    current={token}
                  />
                ) : (
                  <span className="italic">undefined</span>
                )}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  )
}

function HighlightedToken({ previous, current }) {
  // const [showDetails, setShowDetails] = useState(false)
  const showDetails = false
  const l = previous ? Math.min(previous.length, current.length) : 0
  var i = 0
  for (i = 0; i < l; i++) {
    if (previous[i] !== current[i]) {
      break
    }
  }
  return (
    <>
      <span
      // onClick={(e) => setShowDetails((v) => !v)}
      // className="cursor-pointer"
      >
        {i === 0 ? (
          current
        ) : (
          <>
            <span className="text-gray-400">{current.substr(0, i)}</span>
            <span>{current.substr(i)}</span>
          </>
        )}
      </span>
      <ul className={`list-inside ${showDetails ? '' : 'hidden'}`}>
        <li className="border-l-8 pl-4">
          <pre>{JSON.stringify(JSON.parse(atob(current)), null, 2)}</pre>
        </li>
      </ul>
    </>
  )
}

function Error({ isError }) {
  return isError ? (
    <div className="mt-4 bg-red-400 text-white px-8 py-4">An error occured</div>
  ) : null
}

function Heading() {
  return (
    <div className="mb-6">
      <h1 className="mx-auto text-center text-4xl tracking-tight leading-10 font-extrabold text-gray-900 sm:text-5xl sm:leading-none md:text-6xl">
        Pagination with AWS AppSync
      </h1>
      <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl mx-auto md:mt-5 md:text-xl">
        Simple todo app that showcases pagination with AppSync and the Amplify{' '}
        <a
          href="https://docs.amplify.aws/cli/graphql-transformer/directives#model"
          target="_blank"
          rel="noreferrer noopener"
          className="font-mono text-orange-500"
        >
          @model
        </a>{' '}
        directive. Select a user to retrieve their todos sorted by due date.
      </p>
    </div>
  )
}

function App() {
  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState(false)

  const [nextToken, setNextToken] = useState(undefined)
  const [nextNextToken, setNextNextToken] = useState()
  const [previousTokens, setPreviousTokens] = useState([])

  const [todo, setTodo] = useState({ ...TODO_DEFAULT })
  const [owner, setOwner] = useState('')
  const [sortDirection, setSortDirection] = useState(SORT.ASC)

  const [todos, setTodos] = useState([])

  const hasNext = !!nextNextToken
  const hasPrev = previousTokens.length
  const limit = 10

  useEffect(() => {
    const fetch = async () => {
      setIsLoading(true)
      setIsError(false)
      try {
        const variables = {
          nextToken,
          owner,
          limit,
          sortDirection,
        }
        const result = await API.graphql(
          graphqlOperation(listTodosByDate, variables)
        )
        console.log(result)

        setNextNextToken(result.data.listTodosByDate.nextToken)
        setTodos(result.data.listTodosByDate.items)
      } catch (err) {
        console.log(err)
        setIsError(true)
      } finally {
        setIsLoading(false)
      }
    }

    if (!owner) {
      return
    }
    fetch()
  }, [nextToken, owner, sortDirection])

  const submit = async (e) => {
    e.preventDefault()
    try {
      const variables = {
        input: { ...todo, dueOn: new Date().toISOString() },
      }
      const result = await API.graphql(graphqlOperation(createTodo, variables))
      console.log(result)
      setTodo({ ...TODO_DEFAULT })
    } catch (err) {
      console.log(err)
    }
  }

  const next = () => {
    setPreviousTokens((prev) => [...prev, nextToken])
    setNextToken(nextNextToken)
    setNextNextToken(null)
  }

  const prev = () => {
    setNextToken(previousTokens.pop())
    setPreviousTokens([...previousTokens])
    setNextNextToken(null)
  }

  const reset = () => {
    setNextToken(undefined)
    setPreviousTokens([])
    setNextNextToken(null)
  }

  const toggleSortDirection = () => {
    reset()
    setSortDirection((s) => (s === SORT.ASC ? SORT.DESC : SORT.ASC))
  }

  const resetOwner = (owner) => {
    reset()
    setOwner(owner)
  }

  return (
    <div className="mx-4 sm:mx-auto my-4 max-w-screen-lg">
      <Heading />
      <TodoInput {...{ todo, setTodo, submit }} />
      <Error isError={isError} />
      <Table
        {...{
          todos,
          owner,
          resetOwner,
          sortDirection,
          toggleSortDirection,
        }}
      />
      <TodoNavigate {...{ hasNext, hasPrev, prev, next, isLoading }} />
      <TokenConsole {...{ limit, nextToken, nextNextToken, previousTokens }} />
    </div>
  )
}

export default App
