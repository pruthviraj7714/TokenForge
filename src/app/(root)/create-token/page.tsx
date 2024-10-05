"use client";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  image: z.string().url({ message: "Image must be valid URL" }),
  name: z
    .string()
    .min(2, { message: "Name for token must be at least of 2 characters" })
    .max(8, { message: "Name for token must be maximum of 8 characters" }),
  symbol: z
    .string()
    .min(2, { message: "Symbol must be at least of 2 charcters" })
    .max(6, { message: "Symbol should be no longer than 6 characters" }),
  supply: z.number().min(1, {message : "Put the Amount to mint"}),
});

export default function CreateTokenPage() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      image: "",
      name: "",
      symbol: "",
      supply: 0,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-purple-900 via-slate-800 to-black">
      <Card className="w-[550px] p-8 bg-opacity-90 bg-gradient-to-b from-gray-800 to-gray-900 shadow-lg rounded-lg border border-gray-700">
        <CardTitle className="my-6 text-2xl font-semibold text-white">
          Create your own token
        </CardTitle>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-300">Name</FormLabel>
                    <FormControl>
                      <Input
                        className="bg-gray-700 text-white border-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Enter name for your token"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="symbol"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-300">Symbol</FormLabel>
                    <FormControl>
                      <Input
                        className="bg-gray-700 text-white border-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Enter Symbol for your token"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-300">Image</FormLabel>
                    <FormControl>
                      <Input
                        className="bg-gray-700 text-white border-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Enter image url for your token"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="supply"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-300">Supply</FormLabel>
                    <FormControl>
                      <Input
                        className="bg-gray-700 text-white border-none focus:ring-2 focus:ring-purple-500"
                        type="number"
                        placeholder="Enter the amount of tokens to mint"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 rounded-lg transition duration-300"
                type="submit"
              >
                Submit
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
