import { useState } from "react"

const MojoHero = () => {
	const [imagesBaseUri] = useState(() => {
		const w = window as any
		return w.IMAGES_BASE_URI || ""
	})

	return (
		<div className="flex flex-col items-center justify-center pb-4 forced-color-adjust-none">
			<div className="mx-auto">
				<img src={imagesBaseUri + "/logo.png"} alt="Mojo logo" className="h-8 w-auto" />
			</div>
		</div>
	)
}

export default MojoHero
