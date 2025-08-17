import { useTranslation } from "react-i18next"
import { SquareArrowOutUpRightIcon } from "lucide-react"

import { type HistoryItem } from "@Mojo-code/types"

import {
	Button,
	StandardTooltip,
} from "@/components/ui"

interface ShareButtonProps {
	item?: HistoryItem
	disabled?: boolean
	showLabel?: boolean
}

export const ShareButton = ({ item, disabled = true, showLabel = false }: ShareButtonProps) => {
	const { t } = useTranslation()

	return (
		<StandardTooltip content={t("chat:shareButton.tooltip")}>
			<Button
				variant="ghost"
				size="sm"
				disabled={disabled}
				className="h-8 px-2 text-xs"
			>
				<SquareArrowOutUpRightIcon size={14} />
				{showLabel && (
					<span className="ml-1">{t("chat:shareButton.share")}</span>
				)}
			</Button>
		</StandardTooltip>
	)
}
