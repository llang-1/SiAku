"use client";
import type { DateValue } from "@internationalized/date";
import {
  Card,
  CardHeader,
  CardBody,
  Button,
  Input,
  Spacer,
  Divider,
  Form,
  Progress,
} from "@heroui/react";
import { DatePicker } from "@heroui/react";
import { FormatError } from "intl-messageformat";
import { useEffect, useState } from "react";
import React from "react";
import axios from "axios";

const api = axios.create({
  adapter: "xhr",
});

type DataKepribadian = {
  data: {
    profil_umum: {
      tipe: string;
      deskripsi: string;
    };
    analisis_nama: {
      energi: string;
      karakter: string[];
      ringkasan: string;
    };
    analisis_hari: {
      hari: string;
      sifat: string[];
      tantangan: string[];
    };
    numerologi: {
      angka: number;
      makna: string;
    };
    rekomendasi: {
      fokus: string[];
      peringatan: string;
    };
  };
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default function Home() {
  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <CardForm />
    </section>
  );
}

const CardForm = () => {
  const [percent, setPercent] = useState(0);
  const [visible, setIsVisible] = useState(false);
  const [name, setName] = useState("");
  const [birth, setBirth] = useState<DateValue | null>();
  const [data, setData] = useState<DataKepribadian | null>(null);
  const tes = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPercent(0);
    setIsVisible(true);

    const waitForServer = setInterval(() => {
      setPercent((p) => (p < 80 ? p + 2 : p));
    }, 200);

    try {
      // sleep(2000)
      const response = await axios.post(
        "/api/check-kepribadian",

        {
          namaLengkap: name,
          hariLahir: birth,
        },

        {
          headers: {
            "Content-Type": "application/json",
          },
          adapter: "xhr",
          onUploadProgress: (progressEvent: any) => {
            if (progressEvent.total) {
              const percent = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total,
              );

              setPercent((p) => Math.max(p, percent * 0.8));
            } else {
              console.log(`Uploaded: ${progressEvent.loaded} bytes`);
            }
          },
        },
      );

      console.log(response.data);
      clearInterval(waitForServer);
      setData(response.data);
      setPercent(100);
    } catch (error) {
      console.log(error);
      tes(e)
    }
  };


  return (
    <>
      {visible ? (
        <Progress
          aria-label="Downloading..."
          className="max-w-md mb-2"
          color="primary"
          showValueLabel={true}
          size="md"
          value={percent}
        />
      ) : (
        ""
      )}
      <form className="gap-0" onSubmit={tes}>
        <div className="flex flex-col items-start mb-8">
          <h4 className="text-large">Cek Kepribadian</h4>
          <p className="text-small text-default-500">
            isi input ini untuk mengecek kepribadian, masukan nama dan tanggal
            lahir dengan benar.
          </p>
        </div>
        <div className="mb-4">
          <Input
            isClearable
            isRequired
            label="Organization Name"
            maxLength={50}
            name="orgName"
            value={name}
            onValueChange={setName}
          />
        </div>
        <div className="mb-4">
          <DatePicker
            isRequired
            onChange={setBirth}
            value={birth}
            className="max-w-[284px]"
            label="Hari lahir"
          />
        </div>
        <div className="flex items-center gap-2">
          <Button color="primary" type="submit">
            Cek Sekarang
          </Button>
          <Button variant="flat" type="reset">
            Reset
          </Button>
        </div>
      </form>

      {data && (
        <>
          <section className="flex flex-col items-start mt-4 w-full">
            
            <Card className="bg-gray-800 w-full mb-4">
              <CardHeader className="font-bold text-xl">
                <h2>Profil Umum</h2>
              </CardHeader>
              <CardBody>
                <p className="text-sm text-gray-300">
                  {data.data.profil_umum.tipe}
                </p>
                <p className="text-sm text-gray-400 mt-2">
                  {data.data.profil_umum.deskripsi}
                </p>
              </CardBody>
            </Card>


            <Card className="bg-gray-800 w-full mb-4">
              <CardHeader className="font-bold text-xl">
                <h2>Analisis Nama</h2>
              </CardHeader>
              <CardBody>
                <p className="text-sm text-gray-400 mb-3">
                  Energi: {data.data.analisis_nama.energi}
                </p>

                <div className="flex flex-wrap gap-2">
                  {data.data.analisis_nama.karakter.map(
                    (item: string, i: number) => (
                      <span
                        key={i}
                        className="px-3 py-1 text-sm rounded-full bg-primary/20 text-primary border border-primary/30"
                      >
                        {item}
                      </span>
                    ),
                  )}
                </div>

                <p className="text-sm text-gray-300 mt-4">
                  {data.data.analisis_nama.ringkasan}
                </p>
              </CardBody>
            </Card>

            <Card className="bg-gray-800 w-full mb-4">
              <CardHeader className="font-bold text-xl">
                <h2>Analisis Hari</h2>
              </CardHeader>
              <CardBody>
                <p className="text-sm text-gray-400 mb-2">Sifat:</p>
                <div className="flex flex-wrap gap-2 mb-3">
                  {data.data.analisis_hari.sifat.map(
                    (item: string, i: number) => (
                      <span
                        key={i}
                        className="px-3 py-1 text-sm rounded-full bg-green-700/20 text-green-700 border border-green-700/30"
                      >
                        {item}
                      </span>
                    ),
                  )}
                </div>

                <p className="text-sm text-gray-400 mb-2">Tantangan:</p>
                <div className="flex flex-wrap gap-2">
                  {data.data.analisis_hari.tantangan.map(
                    (item: string, i: number) => (
                      <span
                        key={i}
                        className="px-3 py-1 text-sm rounded-full bg-red-700/20 text-red-700 border border-red-700/30"
                      >
                        {item}
                      </span>
                    ),
                  )}
                </div>
              </CardBody>
            </Card>

            <Card className="bg-gray-800 w-full mb-4">
              <CardHeader className="font-bold text-xl">
                <h2>Numerologi</h2>
              </CardHeader>
              <CardBody>
                <p className="text-sm text-gray-300">
                  {data.data.numerologi.makna}
                </p>
              </CardBody>
            </Card>

            <Card className="bg-gray-800 w-full mb-4">
              <CardHeader className="font-bold text-xl">
                <h2>Rekomendasi</h2>
              </CardHeader>
              <CardBody>
                <p className="text-sm text-gray-400 mb-2">Fokus:</p>
                <div className="flex flex-wrap gap-2 mb-3">
                  {data.data.rekomendasi.fokus.map(
                    (item: string, i: number) => (
                      <span
                        key={i}
                        className="px-3 py-1 text-sm rounded-full bg-blue-700/20 text-blue-700 border border-blue-700/30"
                      >
                        {item}
                      </span>
                    ),
                  )}
                </div>

                <p className="text-sm text-gray-300">
                  Peringatan: {data.data.rekomendasi.peringatan}
                </p>
              </CardBody>
            </Card>
          </section>
        </>
      )}
    </>
  );
};

// const CardResult = () => {
//   return (

//   );
// };
