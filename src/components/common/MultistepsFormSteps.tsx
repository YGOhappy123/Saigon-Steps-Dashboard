import { Check } from 'lucide-react'
import { twMerge } from 'tailwind-merge'

type MultistepsFormStepsProps = {
    formSteps: {
        title: string
        description: string
    }[]
    currentStep: number
}

const MultistepsFormSteps = ({ formSteps, currentStep }: MultistepsFormStepsProps) => {
    return (
        <ol className="flex w-full max-w-4xl items-center rounded-xl border-2">
            {formSteps.map((item, index) => (
                <li key={index} className="group relative flex flex-1 cursor-pointer items-center gap-4 px-6 py-4">
                    <div
                        className={twMerge(
                            'flex aspect-square w-10 items-center justify-center rounded-full border-2',
                            currentStep > index
                                ? 'border-primary bg-primary'
                                : currentStep === index
                                  ? 'border-primary'
                                  : 'border-muted-foreground group-hover:border-foreground'
                        )}
                    >
                        {currentStep > index ? (
                            <Check />
                        ) : (
                            <span
                                className={twMerge(
                                    'font-medium',
                                    currentStep === index
                                        ? 'text-primary'
                                        : 'text-muted-foreground group-hover:text-foreground'
                                )}
                            >
                                {(index + 1).toString().padStart(2, '0')}
                            </span>
                        )}
                    </div>
                    <span
                        className={twMerge(
                            'hidden font-medium text-balance lg:inline-block',
                            currentStep >= index ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'
                        )}
                    >
                        {item.title}
                    </span>

                    {index < formSteps.length - 1 && (
                        <div className="absolute top-0 right-0 h-full w-5">
                            <svg
                                viewBox="0 0 22 80"
                                fill="none"
                                preserveAspectRatio="none"
                                className="text-border h-full w-full"
                            >
                                <path
                                    d="M0 -2L20 40L0 82"
                                    stroke="currentcolor"
                                    strokeWidth={2}
                                    vectorEffect="non-scaling-stroke"
                                    strokeLinejoin="round"
                                ></path>
                            </svg>
                        </div>
                    )}
                </li>
            ))}
        </ol>
    )
}

export default MultistepsFormSteps
