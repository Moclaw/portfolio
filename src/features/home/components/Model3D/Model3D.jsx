import { styles } from "../../../../shared/styles";
import { RoomCanvas } from "../../../tech/components/canvas";

const Model3D = () => {
	return (
		<section className="relative w-full h-screen mx-auto">
			<div
				className={`absolute inset-0 top-[120px] max-w-7xl mx-auto ${styles.paddingX} flex flex-row items-start gap-5`}
			>
				<div className='flex flex-col justify-center items-center mt-5'>
					<div className='w-5 h-5 rounded-full bg-[#915EFF]' />
					<div className='w-1 sm:h-80 h-40 violet-gradient' />
				</div>

				<div>
					<h1 className={`${styles.Model3DHeadText} text-white`}>
						Hi, I'm <span className='text-[#915EFF]'>Moclaw</span>
					</h1>
					<p className={`${styles.Model3DSubText} mt-2 text-white-100`}>
						I am a Software Engineer specializing in .NET and React, Angular
					</p>
				</div>
			</div>

			<div className="flex flex-col items-center justify-center h-full">
				<RoomCanvas />
			</div>
		</section>
	);
};

export default Model3D;
