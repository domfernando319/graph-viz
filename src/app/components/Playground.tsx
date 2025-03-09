import React from 'react'

const Playground = () => {
  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
        <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700">Input 1</label>
                <input
                    type="text"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Input 2</label>
                <input
                    type="text"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Selection 1</label>
                <div className="mt-2 space-x-4">
                    <label className="inline-flex items-center">
                    <input type="radio" name="selection1" className="form-radio" />
                    <span className="ml-2">Option A</span>
                    </label>
                    <label className="inline-flex items-center">
                    <input type="radio" name="selection1" className="form-radio" />
                    <span className="ml-2">Option B</span>
                    </label>
                </div>
            </div>

            {/* <div>
                <label className="block text-sm font-medium text-gray-700">Selection 2</label>
                <div className="mt-2 space-x-4">
                    <label className="inline-flex items-center">
                    <input type="radio" name="selection2" className="form-radio" />
                    <span className="ml-2">Option X</span>
                    </label>
                    <label className="inline-flex items-center">
                    <input type="radio" name="selection2" className="form-radio" />
                    <span className="ml-2">Option Y</span>
                    </label>
                </div>
            </div> */}

            <button className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                Run
            </button>
        </div>
    </div>
  )
}

export default Playground
