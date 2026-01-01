import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp";

interface OTPInputProps {
    value: string;
    onChange: (value: string) => void;
    maxLength?: number;
}

export const OTPInput = ({ value, onChange, maxLength = 6 }: OTPInputProps) => {
    return (
        <div className="flex justify-center my-4">
            <InputOTP maxLength={maxLength} value={value} onChange={onChange}>
                <InputOTPGroup>
                    {Array.from({ length: maxLength }).map((_, i) => (
                        <InputOTPSlot key={i} index={i} />
                    ))}
                </InputOTPGroup>
            </InputOTP>
        </div>
    );
};
