import { Button } from "@chakra-ui/react";
import type { ButtonProps } from "@chakra-ui/react";      // 👈 type-only
import { Link as RouterLink, type LinkProps } from "react-router-dom";

type LinkButtonProps = ButtonProps & LinkProps;

export default function LinkButton(props: LinkButtonProps) {
    const { to, ...rest } = props;
    return (
        <Button as={RouterLink as any} {...(rest as any)} to={to as any} />

    );
}
