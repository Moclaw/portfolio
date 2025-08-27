import { styles } from "../../../../shared/styles";
import { RoomCanvas } from "../../../tech/components/canvas";

const Model3D = () => {
	return (
		<section className="relative w-full h-screen mx-auto" style={{ touchAction: 'pan-y' }}>
			<div
				className={`absolute inset-0 top-[80px] sm:top-[120px] max-w-7xl mx-auto ${styles.paddingX} flex flex-col sm:flex-row items-start gap-3 sm:gap-5 z-10`}
			>
				<div className='flex flex-col justify-center items-center mt-2 sm:mt-5'>
					<div className='w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-[#915EFF]' />
					<div className='w-1 h-20 sm:h-40 lg:h-80 violet-gradient' />
				</div>

				<div className="flex-1">
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
