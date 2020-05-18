import React, { useState, useEffect } from 'react'

import moment from 'moment'
import {
  ChevronDown,
  ChevronUp,
  ChevronsLeft,
  ChevronsRight,
  PenTool,
  X,
} from 'react-feather'

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
    <div className="px-4 py-2 mb-4 rounded shadow-md lg:py-4 lg:px-8">
      <table className="w-full text-sm table-auto">
        <thead>
          <tr className="border-b">
            <th className="py-2 text-left">
              <div className="flex justify-between">
                <div className="relative flex-grow">
                  <select
                    value={owner}
                    onChange={(e) => resetOwner(e.target.value)}
                    className="w-full px-4 py-2 leading-tight text-gray-700 bg-gray-200 border-2 border-gray-200 rounded appearance-none focus:outline-none focus:bg-white focus:border-orange-500"
                  >
                    <option value="">Select a user</option>
                    <option value="admin">admin</option>
                    <option value="axel">axel</option>
                    <option value="bernice">bernice</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 pointer-events-none">
                    <ChevronDown size={'1rem'} />
                  </div>
                </div>
                <div className="inline-flex items-center ml-6 whitespace-no-wrap sm:hidden">
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
            <th className="hidden px-8 py-2 text-left sm:table-cell">
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
          </tr>
        </thead>
        {todos.map((todo, i) => (
          <tbody
            key={todo.id}
            className={`align-top ${i % 2 === 1 ? '' : 'bg-gray-100'}`}
          >
            <tr>
              <td className="p-2 text-left">
                <span className="block text-xs font-semibold text-gray-500 uppercase whitespace-no-wrap">
                  {todo.id}
                </span>
                <span className="text-xs font-semibold text-gray-500 uppercase sm:hidden">
                  {moment(todo.dueOn).calendar()} -{' '}
                </span>
                <span>{todo.owner}</span>
              </td>
              <td className="hidden px-8 py-2 text-left sm:table-cell">
                <span className="text-xs font-semibold text-gray-500 uppercase">
                  {moment(todo.dueOn).calendar()}
                </span>
              </td>
            </tr>
            <tr>
              <td colspan="2" className="hidden p-2 text-left md:table-cell">
                <span className="text-xs font-semibold text-gray-500 uppercase">
                  {todo.name}
                </span>
                <span className="block">{todo.description}</span>
              </td>
            </tr>
          </tbody>
        ))}
      </table>
    </div>
  )
}

function TodoInput({ todo, setTodo, submit }) {
  const [open, setOpen] = useState(false)
  const { name, owner, description } = todo
  const onChange = (change) => {
    setTodo((t) => ({ ...t, ...change }))
  }

  const disabled = !name || !description
  return (
    <div className="mb-4 overflow-hidden bg-white rounded shadow-md">
      <div className="flex items-center justify-between px-4 py-2 text-sm bg-orange-200 lg:px-8 lg:py-4">
        <div className="font-semibold">Add new todo</div>
        <button
          onClick={() => setOpen((o) => !o)}
          className="px-4 py-2 font-bold text-white bg-orange-500 rounded shadow lg:px-8 focus:shadow-outline focus:outline-none"
        >
          {open ? (
            <X size="1rem" className="inline-block" />
          ) : (
            <PenTool size="1rem" className="inline-block" />
          )}
        </button>
      </div>
      <form className={`${open ? '' : 'hidden'} m-4`} onSubmit={submit}>
        <div className="mb-6 md:flex md:items-center">
          <div className="md:w-1/3">
            <label
              className="block pr-4 mb-1 font-bold text-gray-500 md:text-right md:mb-0"
              htmlFor="owner"
            >
              Owner
            </label>
          </div>
          <div className="md:w-2/3">
            <input
              className="w-full px-4 py-2 leading-tight text-gray-700 bg-gray-200 border-2 border-gray-200 rounded appearance-none focus:outline-none focus:bg-white focus:border-orange-500"
              name="owner"
              value={owner}
              onChange={(e) => onChange({ owner: e.target.value })}
            />
          </div>
        </div>
        <div className="mb-6 md:flex md:items-center">
          <div className="md:w-1/3">
            <label
              className="block pr-4 mb-1 font-bold text-gray-500 md:text-right md:mb-0"
              htmlFor="name"
            >
              Name
            </label>
          </div>
          <div className="md:w-2/3">
            <input
              className="w-full px-4 py-2 leading-tight text-gray-700 bg-gray-200 border-2 border-gray-200 rounded appearance-none focus:outline-none focus:bg-white focus:border-orange-500"
              name="name"
              value={name}
              onChange={(e) => onChange({ name: e.target.value })}
            />
          </div>
        </div>
        <div className="mb-6 md:flex">
          <div className="md:w-1/3">
            <label
              className="block pr-4 mb-1 font-bold text-gray-500 md:text-right md:mb-0"
              htmlFor="description"
            >
              Description
            </label>
          </div>
          <div className="md:w-2/3">
            <textarea
              className="w-full h-32 px-4 py-2 leading-tight text-gray-700 bg-gray-200 border-2 border-gray-200 rounded appearance-none md:h-20 focus:outline-none focus:bg-white focus:border-orange-500"
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
    </div>
  )
}

function TodoNavigate({ isLoading, hasNext, hasPrev, next, prev }) {
  const disabledPrev = !hasPrev || isLoading
  const disabledNext = !hasNext || isLoading
  return (
    <div className="flex justify-between px-4 py-2 mb-4 text-sm bg-white rounded shadow-md lg:py-4 lg:px-8">
      <button
        className={`${
          disabledPrev
            ? 'bg-orange-500 opacity-50 cursor-not-allowed'
            : 'bg-orange-500 hover:bg-orange-400'
        } shadow focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded`}
        disabled={disabledPrev}
        onClick={prev}
      >
        <ChevronsLeft size="1rem" className="inline-block mr-2" />
        <span>Previous</span>
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
        <span>Next</span>
        <ChevronsRight size="1rem" className="inline-block ml-2" />
      </button>
    </div>
  )
}

function TokenConsole({ limit, nextToken, nextNextToken, previousTokens }) {
  return (
    <div className="px-4 py-2 mb-8 font-mono text-xs rounded shadow-md lg:py-4 md:text-sm lg:px-8">
      <div className="py-2 mb-3 border-b border-gray-400">
        <div>
          limit: {limit} (number of items to fetch per query; a.k.a page size)
        </div>
      </div>
      <div className="py-2 my-3 border-b border-gray-400">
        <div>nextToken (used in the last query):</div>
        <div className="pt-2 pb-4 overflow-x-auto whitespace-no-wrap">
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
      <div className="pt-2 pb-2 my-3 border-b border-gray-400">
        <div>
          Next nextToken (assign to{' '}
          <span className="font-semibold">nextToken</span> when user clicks{' '}
          <span className="font-semibold">Next</span>):
        </div>
        <div className="pt-2 pb-4 overflow-x-auto whitespace-no-wrap">
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
      <div className="pt-2 pb-2 my-3 border-b border-gray-400">
        <div>
          Previous Tokens (pop the last token and assign it to{' '}
          <span className="font-semibold">nextToken</span> when user clicks{' '}
          <span className="font-semibold">Previous</span>):
        </div>
        <div className="pt-2 pb-4 overflow-x-auto whitespace-no-wrap">
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
        <li className="pl-4 border-l-8">
          <pre>{JSON.stringify(JSON.parse(atob(current)), null, 2)}</pre>
        </li>
      </ul>
    </>
  )
}

function Error({ isError }) {
  return isError ? (
    <div className="px-4 py-4 mt-4 text-white bg-red-400 lg:px-8">
      An error occured
    </div>
  ) : null
}

function Heading() {
  return (
    <div className="mb-6">
      <h1 className="mx-auto text-4xl font-extrabold leading-10 tracking-tight text-center text-gray-900 sm:text-5xl sm:leading-none md:text-6xl">
        Pagination with AWS AppSync
      </h1>
      <p className="mx-auto mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl md:mt-5 md:text-xl">
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
    <div className="max-w-screen-xl mx-auto my-4">
      <Heading />
      <div className="flex flex-col px-2 lg:flex-row">
        <div className="lg:w-1/2">
          <div className="lg:hidden">
            <TodoInput {...{ todo, setTodo, submit }} />
            <Error isError={isError} />
          </div>
          <TodoNavigate {...{ hasNext, hasPrev, prev, next, isLoading }} />
          <Table
            {...{
              todos,
              owner,
              resetOwner,
              sortDirection,
              toggleSortDirection,
            }}
          />
        </div>
        <div className="lg:w-1/2 lg:ml-6">
          <div className="hidden lg:block">
            <TodoInput {...{ todo, setTodo, submit }} />
            <Error isError={isError} />
          </div>
          <TokenConsole
            {...{ limit, nextToken, nextNextToken, previousTokens }}
          />
        </div>
      </div>
    </div>
  )
}

export default App
