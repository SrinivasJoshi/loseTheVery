import { Configuration, OpenAIApi } from 'openai';
import { FC, useState } from 'react';
interface AppProps {}

const configuration = new Configuration({
	apiKey: process.env.REACT_APP_OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const App: FC<AppProps> = () => {
	const [input, setInput] = useState<string>('');
	const [suggestion, setSuggestion] = useState<string>('');
	const [loading, setLoading] = useState(false);

	const combineWords = async (secondWord: string) => {
		setLoading(true);
		try {
			const response = await openai.createCompletion({
				model: 'text-davinci-002',
				prompt: `Combine the word "very" with another adjective to find a more suitable adjective.\n\nvery + cold = freezing\nvery + nice = charming\nvery + high = steep\nvery + shining = gleaming\nvery + ${secondWord} =`,
				temperature: 0.7,
				max_tokens: 256,
				top_p: 1,
				frequency_penalty: 0,
				presence_penalty: 0,
			});

			if (!response.data.choices[0].text) throw new Error('Invalid Response');
			const text = response.data.choices[0].text;
			setSuggestion(text);
		} catch (error) {
			console.log(error);
			alert(error);
		}
		setLoading(false);
	};
	const handleGetResult = async () => {
		combineWords(input);
	};

	const handleRandomResult = async () => {
		setLoading(true);
		let adjective = '';
		try {
			const response = await openai.createCompletion({
				model: 'text-davinci-002',
				prompt:
					'Come up with one random adjective that goes well with the word "very" in front of it:\nAdjective : very',
				temperature: 0.7,
				max_tokens: 25,
				top_p: 1,
				frequency_penalty: 0,
				presence_penalty: 0,
			});

			if (!response.data.choices[0].text) throw new Error('Invalid Response');
			adjective = response.data.choices[0].text
				? response.data.choices[0].text.trim()
				: '';
		} catch (error) {
			console.log(error);
			alert(error);
		}
		setInput(adjective);
		combineWords(adjective);
		setLoading(false);
	};

	return (
		<div className='max-w-7xl sm:max-w-6xl mx-auto flex flex-col items-center mt-32 sm:text-center sm:mb-0'>
			<div className='w-12 h-12 mb-4 sm:mb-0'>
				<img src='https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Ficon-icons.com%2Ficons2%2F931%2FPNG%2F512%2Fpencil_icon-icons.com_72386.png&amp;f=1&amp;nofb=1' />
			</div>
			<div className='text-gray-400 text-center w-9/12 sm:w-fit'>
				Combine "very" with a simple adjective and get a more concise adjective
			</div>
			<div className='grid grid-cols-7 md:grid-cols-12 gap-6 md:gap-0 justify-center items-center w-8/12 sm:w-full mb-4 py-16'>
				<p className='text-center col-span-2 text-xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold'>
					very
				</p>
				<p className='text-center col-span-1 text-xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold'>
					+
				</p>
				<input
					value={input}
					onChange={(e) => setInput(e.target.value)}
					placeholder='boring'
					type='text'
					className='col-span-4 text-center border-b-2 font-sans text-xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold h-fit sm:h-24 transition duration-200 bg-white  border-gray-300 appearance-none focus:outline-none'
				/>
				<p className='text-center col-span-3 md:col-span-1 text-xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold'>
					=
				</p>
				<div className='text-center col-span-4'>
					<p
						className={`cursor-pointer text-center text-xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold ${
							suggestion ? 'text-green-700' : 'text-gray-500'
						} font-serif`}>
						{suggestion || 'tedious'}
					</p>
				</div>
			</div>
			<div className='mb-4 flex flex-row'>
				<div className='pr-6 cursor-pointer'>
					<button
						type='button'
						onClick={() => handleGetResult()}
						className='border-solid bg-black inline-flex items-center justify-center h-12 px-6 font-medium tracking-wide text-white transition duration-200 rounded shadow-md bg-deep-purple-accent-400 hover:bg-deep-purple-accent-700 focus:shadow-outline focus:outline-none'>
						Get/Refresh Result
					</button>
				</div>
				<div className='pl-6 cursor-pointer'>
					<button
						type='button'
						onClick={handleRandomResult}
						className='border-solid bg-black inline-flex items-center justify-center h-12 px-6 font-medium tracking-wide text-white transition duration-200 rounded shadow-md bg-deep-purple-accent-400 hover:bg-deep-purple-accent-700 focus:shadow-outline focus:outline-none'>
						Random
					</button>
				</div>
			</div>
			{loading && (
				<div role='status' className='mt-10'>
					<svg
						className='inline mr-2 w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-gray-600 dark:fill-gray-300'
						viewBox='0 0 100 101'
						fill='none'
						xmlns='http://www.w3.org/2000/svg'>
						<path
							d='M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z'
							fill='currentColor'
						/>
						<path
							d='M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z'
							fill='currentFill'
						/>
					</svg>
					<span className='sr-only'>Loading...</span>
				</div>
			)}
		</div>
	);
};

export default App;
